import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string }}
) {
  try {
    const { userId } =  auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401} );
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    })

    const { list } = await req.json();

    if (!courseOwner) { 
      return new NextResponse("Unauthorized", { status: 401} );
    }
    
    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: {
          position: item.position
        }
      })
    }

    return new NextResponse("Success", { status: 200 } );

  } catch (error) {
    console.log("CHAPTERS REORDER: ", error);
    return new NextResponse("Internal Error", { status: 500})
  }
}