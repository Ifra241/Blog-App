import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";

export async function POST(
  req: NextRequest,
  context: { params: { blogId: string } }
) {
  try {
    const { blogId } = context.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { message: "Invalid blog ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $inc: { views: 1 },
        $push: { viewsHistory: { createdAt: new Date() } }
      },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ views: blog.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json(
      { message: "Error incrementing views" },
      { status: 500 }
    );
  }
}
