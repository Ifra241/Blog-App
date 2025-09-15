import { NextResponse } from "next/server"; 
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";

export async function POST(
  req: Request,
  { params }: { params: { blogId: string } }
) {
  try {
    const { blogId } = params;

    // Validate blogId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { message: "Invalid blog ID" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Increment views
    console.log("blogId from params:", blogId);
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { views: 1 } },
      { new: true }
    );

    console.log("Updated blog:", blog);

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
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
