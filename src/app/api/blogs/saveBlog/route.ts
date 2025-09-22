import { PopulatedBlog } from "@/app/dashboard/blog/[id]/page";
import Blog from "@/lib/models/Blog";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { createNotification } from "@/utils/notify";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { userId, blogId } = await req.json();

  if (!userId || !blogId) {
    return NextResponse.json(
      { message: "Missing userId or blogId" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId);
    const blog=await Blog.findById(blogId).populate("author","fullname") as PopulatedBlog|null;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure savedBlogs is always an array
    if (!user.savedBlogs) user.savedBlogs = [];

    // Convert ObjectIds to string for comparison
    const savedBlogIds = user.savedBlogs.map((id: Types.ObjectId) => id.toString());
    const isSaved = savedBlogIds.includes(blogId);

    if (!isSaved) {
      user.savedBlogs.push(blogId); // Save
//Create Notification
      if(blog?.author &&blog.author._id.toString()!==userId){
        await createNotification(blog.author._id.toString(),
         `${user.fullname} saved your blog`,
         blogId
      );
      }

      
    } else {
      user.savedBlogs = user.savedBlogs.filter((id: Types.ObjectId) => id.toString() !== blogId);
    }

    await user.save();

    return NextResponse.json({ savedBlogs: user.savedBlogs.map((id:Types.ObjectId) => id.toString()) });
  } catch (err) {
    console.error("Error in saveBlog:", err);
    return NextResponse.json({ message: "Server error", error: err }, { status: 500 });
  }
}
