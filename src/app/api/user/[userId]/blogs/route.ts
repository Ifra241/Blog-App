import Blog from "@/lib/models/Blog";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDatabase();

    
    const { userId } = params;

    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });


    return NextResponse.json(blogs || []);
  } catch (error) {
    console.error("Error in GET /api/user/[userId]/blogs ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
