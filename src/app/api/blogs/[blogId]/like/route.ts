import Blog, { BlogProp } from "@/lib/models/Blog";
import { connectToDatabase } from "@/lib/mongodb";
import { createNotification } from "@/utils/notify";
import  { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { blogId: string } }
) {
  try {
    await connectToDatabase();

    const { userId,currentUserName }: { userId: string ,currentUserName:string} = await req.json();

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid UserId" }, { status: 400 });
    }

    const blog: BlogProp | null = await Blog.findById(params.blogId);
    if (!blog) {
      return NextResponse.json({ message: "Blog Not Found" }, { status: 404 });
    }

    const hasLiked = blog.likes.some(
      (id: Types.ObjectId) => id.toString() === userId
    );

    if (hasLiked) {
      blog.likes = blog.likes.filter(
        (id: Types.ObjectId) => id.toString() !== userId
      );
    } else {
      blog.likes.push(new Types.ObjectId(userId));
    }
// create Notification
if(blog.author && blog.author.toString()!==userId){
  await createNotification(blog.author.toString(),
   `${currentUserName} liked your blog`
);
}

 
await blog.save({ validateBeforeSave: false });

    return NextResponse.json({
      message: hasLiked ? "Unliked" : "Liked",
      likesCount: blog.likes.length,
    });
  } catch (error) {
      console.error("LIKE ROUTE ERROR:", error);
    return NextResponse.json(
      { message: "Error liking blog", error },
      { status: 500 }
    );
  }
}
