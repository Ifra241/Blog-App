import Blog from "@/lib/models/Blog";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

//get blog

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectToDatabase();

    
    const resolvedParams = await params;
    const { userId } = resolvedParams; 

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
