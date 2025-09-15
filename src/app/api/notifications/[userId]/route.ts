import { NextResponse } from "next/server";
import Notification from "@/lib/models/Notification";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

interface Props {
  params: { userId: string };
}

export async function GET(req: Request, { params }: Props) {
  const userId = params.userId;

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Convert to ObjectId if needed
    const objectId = new mongoose.Types.ObjectId(userId);

    const notifications = await Notification.find({ user: objectId }).sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}
