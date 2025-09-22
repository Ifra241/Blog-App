import { NextResponse } from "next/server";
import Comment from "@/lib/models/Comment";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";
import { createNotification } from "@/utils/notify";
import User from "@/lib/models/User";
import { Types } from "mongoose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { blogId, userId, content} = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    const comment = await Comment.create({ blog: blogId, user: userId, content });
    await comment.populate("user", "fullname profilePic");
    
    //Get user name
     const user = await User.findById(userId);
    const currentUserName = user?.fullname || "Someone";
    //Snd Notification
    const blog=await Blog.findById(blogId);
    if(blog?.author && blog.author.toString()!==userId){
      const message=`${currentUserName} commented on your blog "${blog.title}"`;
  await createNotification(blog.author.toString(), message, (blog._id as Types.ObjectId).toString() );      
    }
  

    return NextResponse.json(comment, { status: 201 });

  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { message: "Failed to add comment" },
      { status: 500 }
    );
  }
}
//Get
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    if (!blogId) {
      return NextResponse.json(
        { message: "Blog ID is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "fullname profilePic")
      .sort({ createdAt: 1 });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
//Delete

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json({ message: "Comment ID is required" }, { status: 400 });
    }

    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ message: "Failed to delete comment" }, { status: 500 });
  }
}
//Edit

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const { commentId, content } = await req.json();

    if (!commentId || !content) {
      return NextResponse.json({ message: "Comment ID and content are required" }, { status: 400 });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ message: "Failed to update comment" }, { status: 500 });
  }
}


