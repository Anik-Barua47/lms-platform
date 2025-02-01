import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params; // Ensure that params are awaited before using

    const values = await req.json();
    console.log("Received values:", values);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: { id: courseId, userId },
      data: { ...values },
    });
    console.log(values);

    return NextResponse.json(course);
  } catch (error) {
    console.error("COURSE_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
