import Blog from "@/lib/models/Blog";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDatabase();

    console.log("Route hit ");
    console.log("Params received ", params);

    const { userId } = params;
    console.log("Extracted userId ", userId);

    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

    console.log("Blogs found ", blogs);

    return NextResponse.json(blogs || []);
  } catch (error) {
    console.error("Error in GET /api/user/[userId]/blogs ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
