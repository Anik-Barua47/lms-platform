import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb"; // Import ObjectId from mongodb

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // Validate if the courseId is a valid ObjectId
  if (!ObjectId.isValid(params.courseId)) {
    return redirect("/"); // If not valid, redirect to home
  }

  const course = await db.course.findUnique({
    where: {
      id: new ObjectId(params.courseId).toString(), // Ensure the ID is properly formatted
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return <div>course id is {params.courseId}</div>;
};

export default CourseIdPage;
