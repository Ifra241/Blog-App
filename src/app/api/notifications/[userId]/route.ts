import { NextResponse } from "next/server";
import Notification from "@/lib/models/Notification";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

interface Props {
  params: Promise<{ userId: string }>;
}

export async function GET(req: Request, { params }: Props) {
  const resolvedParams = await params;
  const { userId } = resolvedParams;

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const objectId = new mongoose.Types.ObjectId(userId);

    const notifications = await Notification.find({ user: objectId })
      .sort({ createdAt: -1 })
      .lean(); 
 

    const notificationsWithBlogId = notifications.map(n => ({
      ...n,
      blogId: n.blogId ? n.blogId.toString() : undefined
    }));

    return NextResponse.json(notificationsWithBlogId);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}
