import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

const StatisticsPage = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({
    accepted: 0,
    pending: 0,
    totalReviews: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get("/api/statistics");
        setStats({
          accepted: res.data.approvedProducts,
          pending: res.data.pendingProducts,
          totalReviews: res.data.totalReviews,
          totalUsers: res.data.totalUsers,
        });
      } catch (err) {
        console.error("Error loading statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  const pieData = [
    { name: "Accepted Products", value: stats.accepted },
    { name: "Pending Products", value: stats.pending },
    { name: "Total Reviews", value: stats.totalReviews },
    { name: "Total Users", value: stats.totalUsers },
  ];

  if (loading) {
    return <div className="text-center py-10">Loading statistics...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-8">📊 Site Statistics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsPage;
