import { Iconbadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  // console.log("Params before resolving:", params);
  const resolvedParams = await params;
  // console.log("Params after resolving:", resolvedParams);
  const courseId = resolvedParams.courseId;

  if (!courseId) {
    return redirect("/");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Fetch course data
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // console.log(categories);

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

  const completedFields = requiredFields.filter(Boolean).length;
  const totalFields = requiredFields.length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <Iconbadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your cousre</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={courseId} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
