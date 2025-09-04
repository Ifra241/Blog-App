import Blog, { BlogProp } from "@/lib/models/Blog";
import { connectToDatabase } from "@/lib/mongodb";
import  { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { blogId: string } }
) {
  try {
    await connectToDatabase();

    const { userId }: { userId: string } = await req.json();

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

    await blog.save();

    return NextResponse.json({
      message: hasLiked ? "Unliked" : "Liked",
      likesCount: blog.likes.length,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error liking blog", error },
      { status: 500 }
    );
  }
}
