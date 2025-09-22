import cloudinary from "@/lib/cloudinary";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    //  Delete old image if new one uploaded
    if (
      data.profilePic?.public_id &&
      user.profilePicPublicId &&
      data.profilePic.public_id !== user.profilePicPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(user.profilePicPublicId);
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }
    }

    //  Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        fullname: data.fullname,
        bio: data.bio,
        profilePic: data.profilePic?.secure_url || user.profilePic,
        profilePicPublicId: data.profilePic?.public_id || user.profilePicPublicId,
      },
      { new: true }
    );

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
  }
}
