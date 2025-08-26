import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

 export interface FollowBody {
  targetUserId: string;
  currentUserId: string;
  action: "follow" | "unfollow";

}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { targetUserId, currentUserId, action } = (await req.json()) as FollowBody;

    if (!targetUserId || !currentUserId) {
      return NextResponse.json({ message: "Missing User IDs" }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);
    if (!targetUser || !currentUser) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    const targetIdObj = new Types.ObjectId(targetUserId);
    const currentIdObj = new Types.ObjectId(currentUserId);

    if (action === "follow") {
      // Only add if not already following
      if (!targetUser.followers.some((id:Types.ObjectId) => id.equals(currentIdObj))) {
        targetUser.followers.push(currentIdObj);
      }
      if (!currentUser.following.some((id:Types.ObjectId) => id.equals(targetIdObj))) {
        currentUser.following.push(targetIdObj);
      }
    } else if (action === "unfollow") {
      targetUser.followers = targetUser.followers.filter((id:Types.ObjectId) => !id.equals(currentIdObj));
      currentUser.following = currentUser.following.filter((id:Types.ObjectId) => !id.equals(targetIdObj));
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // Save both users
    await Promise.all([targetUser.save(), currentUser.save()]);

    // Populate followers and following for response
    await targetUser.populate("followers", "fullname profilePic");
    await currentUser.populate("following", "fullname profilePic");

    return NextResponse.json({
      message: action === "follow" ? "Followed successfully" : "Unfollowed successfully",
      followers: targetUser.followers || [],
      following: currentUser.following || [],
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
