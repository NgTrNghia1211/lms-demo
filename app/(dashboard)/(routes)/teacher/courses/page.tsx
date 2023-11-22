import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';



const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    }, 
    orderBy: {
      createdAt: "desc",
    }
  });

  return (
    <div className='p-6'>
      {/* <Link href="/teacher/create">
        <Button>
          New Course
        </Button>
      </Link> */}

      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage;