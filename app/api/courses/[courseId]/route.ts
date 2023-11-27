import Mux from '@mux/mux-node';
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from '@/lib/teacher';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

export async function PATCH (
  req: Request,
  { params } : {params: {
    courseId: string
  }}
) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized",{ status: 401 });
    }

    const { courseId } = params;
    const values = await req.json();
    
    const course = await db.course.update({
      data: {
        ...values
      },
      where: {
        id: courseId,
        userId: userId
      }
    })

    return NextResponse.json(course);
  } catch (error) {
    console.log("COURSES_ID: ", error);
    return new NextResponse("Internal Error", { status: 500})
  }

}

export async function DELETE(
  req: Request,
  { params } : {params: {
    courseId: string
  }}
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized",{ status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    })

    if (!course) {
      return new NextResponse("Not Found",{ status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter?.muxData?.assetId ) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      }
    })

    return NextResponse.json(deletedCourse);

  } catch (error) {
    console.log("DELETE COURSE: ", error);
    return new NextResponse("Internal Error", { status: 500} )
  }
}