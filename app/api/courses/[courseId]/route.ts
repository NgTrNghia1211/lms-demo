import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH (
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