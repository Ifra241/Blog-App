import Blog from "@/lib/models/Blog";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { authorId: string } }) {
  try {
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(params.authorId)) {
      return NextResponse.json(
        { success: false, message: "Invalid author ID" },
        { status: 400 }
      );
    }

    const authorId = new mongoose.Types.ObjectId(params.authorId);

    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);

    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    // Total Views
    const result = await Blog.aggregate([
      { $match: { author: authorId } },
      { $group: { _id: "$author", totalViews: { $sum: "$views" } } },
    ]);

    // Last Week Views (day-wise)
    const weekResult = await Blog.aggregate([
      { $match: { author: authorId } },
      { $unwind: "$viewsHistory" },
      { $match: { "viewsHistory.createdAt": { $gte: lastWeek } } },
      {
        $group: {
          _id: { dayOfWeek: { $dayOfWeek: "$viewsHistory.createdAt" } },
          views: { $sum: 1 }
        },
      },
      { $sort: { "_id.dayOfWeek": 1 } },
    ]);

    const weekData = [0, 0, 0, 0, 0, 0, 0]; // Sun → Sat
    weekResult.forEach(item => {
      const index = (item._id.dayOfWeek + 5) % 7; // Monday → index 0
      weekData[index] = item.views;
    });

    // Last Month Views (month-wise)
    const monthResult = await Blog.aggregate([
      { $match: { author: authorId } },
      { $unwind: "$viewsHistory" },
      { $match: { "viewsHistory.createdAt": { $gte: lastMonth } } },
      {
        $group: {
          _id: { year: { $year: "$viewsHistory.createdAt" }, month: { $month: "$viewsHistory.createdAt" } },
          views: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return NextResponse.json({
      success: true,
      totalViews: result[0]?.totalViews || 0,
      lastWeek: weekData,
      lastMonth: monthResult.map(m => ({ month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`, views: m.views })),
    });

  } catch (err) {
    console.error("Error fetching total views", err);
    return NextResponse.json(
      { success: false, message: "Error fetching total views" },
      { status: 500 }
    );
  }
}
