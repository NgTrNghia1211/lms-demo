import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string }}
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401})
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', {status: 401})
    }

    const { isPublished, ...values } = await req.json();

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      },
      data: {
        ...values 
      }
    })

    // Video upload: handle

    return NextResponse.json(chapter)

  } catch (error) {
    console.log("TITLE CHAPTER: ", error);
    return new NextResponse('Internal Error', {status: 500})
  }
}