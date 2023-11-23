import { Category, Course } from "@prisma/client";
import CourseCard from "./course-card";

type CourseWithProgressCategory = Course & {
  category: Category | null;
  chapters: {id: string}[];
  progress: number | null;
}

interface CourseListProps {
  items: CourseWithProgressCategory[];
}

const CoursesList = ({
  items
}: CourseListProps) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      <div>
        {items.map((item) => (
          <div key={item.id} className="mt-1">
            <CourseCard 
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              chapterLength={item.chapters.length}
              price={item.price!}
              progress={item.progress}
              category={item?.category?.name!}
            />
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  )
}

export default CoursesList