import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params } : {params: {
    courseId: string
  }}
) {
  try {
    const { userId } = auth();

    if (!userId) { 
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      }, 
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if (!course) {
      return new NextResponse('No course found!', { status:404});
    }

    const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);

    if (!hasPublishedChapters || !course.title || !course.imageUrl || !course.description || !course.categoryId ) {
      return new NextResponse('Missing some required fields!', { status:400} );
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(publishedCourse);

  } catch (error) {
    console.log('PUBLISH COURSE:', error);
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}