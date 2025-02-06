import { db } from "@/lib/db";
import { Mux } from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Initialize Mux client
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Authenticated User ID:", userId);

    // Fetch the course and its chapters
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    console.log("Found Course:", course);

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete Mux assets for each chapter
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        console.log("Deleting Mux Asset:", chapter.muxData.assetId);
        await muxClient.video.assets.delete(chapter.muxData.assetId); // Use 'delete' instead of 'del'
        console.log("Deleted Mux Asset:", chapter.muxData.assetId);
      }
    }

    // Delete the course
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    console.log("Deleted Course:", deletedCourse);

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[COURSE_ID_DELETE] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Updating Course:", params.courseId, "with values:", values);

    // Update the course
    const updatedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    console.log("Updated Course:", updatedCourse);

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("[COURSE_ID_PATCH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
