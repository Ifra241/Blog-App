"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ViewsChartProps {
  authorId: string;
  title?: string;
}

interface WeekDataResponse {
  weekData: number[];
  dailyBreakdown: { day: string; views: number }[];
}

const ViewsChart: React.FC<ViewsChartProps> = ({ authorId, title }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [weekData, setWeekData] = useState<{ day: string; views: number }[]>([]);
  const [monthData, setMonthData] = useState<{ day: string; views: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const res = await fetch(`/api/blogs/author-view/${authorId}`);
        const json: WeekDataResponse & { success: boolean } = await res.json();

        if (!json.success) throw new Error("Failed to fetch views");

        // Weekly chart: Monday → Sunday
        const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const mappedWeek = (json.weekData || []).map((views, idx) => ({
          day: weekLabels[idx],
          views,
        }));

        setWeekData(mappedWeek);

        // Monthly/daily chart
        setMonthData(json.dailyBreakdown || []);

        setDataLoaded(true);
      } catch(err){
        console.error("Fetching failed",err);
        setError( "Error fetching views");
      }
    };

    fetchViews();
  }, [authorId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dataLoaded) return <p>Loading views...</p>;

  return (
    <div className="flex flex-col items-center mt-6">
      <Card className="w-full max-w-4xl my-4">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">{title || "Weekly Views"}</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl my-4">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Last 30 Days Views</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewsChart;
