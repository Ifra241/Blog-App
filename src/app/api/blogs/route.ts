import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/lib/models/User";
import { createNotification } from "@/utils/notify";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.content || !body.author ||
      !body.image?.public_id ||
      !body.image?.folder
    ) {
      return NextResponse.json(
        { error: "All fields including image are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(body.author)) {
      return NextResponse.json({ error: "Invalid author id" }, { status: 400 });
    }

    const newBlog = await Blog.create({
      title: body.title,
      content: body.content,
      category: body.category, 
      author: new mongoose.Types.ObjectId(body.author),
       image: {
    public_id: body.image.public_id,
    folder: body.image.folder,
    secure_url: body.image.secure_url,
    }
      
    });

    const currentUser=await User.findById(body.author);
    if(currentUser&&currentUser.followers?.length>0){
      const followers=await User.find({_id:{$in:currentUser.followers}});
      for(const follower of followers){
        await createNotification(
          follower._id.toString(),
          `${currentUser.fullname} posted a new blog`
        );

      }
    }

    return NextResponse.json(newBlog, { status: 201 });
  } catch (err) {
    console.error("Blog creation error:", err);
    return NextResponse.json(
      { error: "Failed to create blog", details: (err as Error).message },
      { status: 500 }
    );
  }
}
// GET handler
export async function GET() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("author", "username fullname profilePic"); 
      
    return NextResponse.json(blogs);
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
