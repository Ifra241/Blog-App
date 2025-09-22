"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loader from "./Loader";

interface ViewsChartProps {
  authorId: string;
  title?: string;
}

interface NotificationViewsResponse {
  success: boolean;
  totalViews: number;
  lastWeek: number[];
  lastMonth: { month: string; views: number }[];
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
        const json: NotificationViewsResponse = await res.json();

        if (!json.success) throw new Error("Failed to fetch views");

        // Map weekly data (Mon → Sun)
        const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const mappedWeek = (json.lastWeek || []).map((views, idx) => ({
          day: weekLabels[idx],
          views,
        }));
        setWeekData(mappedWeek);

        // Map monthly data
        const mappedMonth = (json.lastMonth || []).map((m) => ({
          day: m.month,
          views: m.views,
        }));
        setMonthData(mappedMonth);

        setDataLoaded(true);
      } catch (err) {
        console.error("Fetching views failed", err);
        setError("Error fetching views");
      }
    };

    fetchViews();
  }, [authorId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dataLoaded) return <div className=" flex items-center justify-center"><Loader/></div>;

  // Unified chart margin
  const chartMargin = { top: 20, right: 10, bottom: 40, left: 0 };
  const chartHeight = 260;

  return (
    <div className="flex flex-wrap gap-6 mt-6 justify-center">
      {/* Weekly Views Chart */}
      <div className="w-[400px] p-3">
        <h2 className="text-md font-semibold text-center mb-2">{title || "Weekly Views"}</h2>
        <div style={{ width: "100%", height: chartHeight }}>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={weekData} margin={chartMargin}>
      <XAxis dataKey="day" />
      <YAxis domain={[0, "auto"]} />
      <Tooltip />
      <Line type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>

      </div>

      {/* Monthly Views Chart */}
      <div className="w-[400px] p-3">
        <h2 className="text-md font-semibold text-center mb-2">Last 30 Days Views</h2>
        <div style={{ width: "100%", height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthData} margin={chartMargin}>
              <XAxis
                dataKey="day"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={40} 
              />
              <YAxis domain={[0, "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ViewsChart;
