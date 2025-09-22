import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectToDatabase();
     const { userId } = params;

    // Populate followers and following with only fullname and profilePic
    const user = await User.findById(userId)
      .select("-email -password") 
      .populate("followers", "fullname profilePic")
      .populate("following", "fullname profilePic");

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
