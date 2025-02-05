import { Mux } from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Initialize Mux client
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});
// console.log("MUX_TOKEN_ID:", process.env.MUX_TOKEN_ID);
// console.log("MUX_TOKEN_SECRET:", process.env.MUX_TOKEN_SECRET);

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        // Use lowercase 'assets' instead of 'Assets'
        // console.log("Deleting Mux Asset:", existingMuxData.assetId);
        await muxClient.video.assets.del(existingMuxData.assetId);

        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
        // console.log("Deleted Mux Data Record:", existingMuxData.id);
      }

      // Use lowercase 'assets' instead of 'Assets'
      console.log("Creating New Mux Asset...");
      const asset = await muxClient.video.assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });
      // console.log("New Mux Asset Created:", asset);

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
      // console.log("Saved New Mux Data to Database:", {
      //   chapterId: params.chapterId,
      //   assetId: asset.id,
      //   playbackId: asset.playback_ids?.[0]?.id,
      // });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error(
      "Error in PATCH /api/courses/[courseId]/chapters/[chapterId]:",
      error
    );
    return new NextResponse("Internal Error", { status: 500 });
  }
}
