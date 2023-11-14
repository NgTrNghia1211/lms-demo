import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  {params} : {params: {courseId: string}}
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const { url } = await req.json();

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    });
    
    if (!courseOwner) {
      return new NextResponse("Forbidden Access", {status: 403});
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: params.courseId
      }
    })

    return NextResponse.json(attachment);

  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS: ", error);
    return new NextResponse("Internal Error", {status: 500});
  }
}