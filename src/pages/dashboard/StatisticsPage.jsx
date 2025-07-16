import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FiUsers, FiCheckCircle, FiClock, FiMessageSquare, FiPackage } from "react-icons/fi";

const StatisticsPage = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({
    accepted: 0,
    pending: 0,
    totalReviews: 0,
    totalUsers: 0,
    totalProducts: 0
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
          totalProducts: res.data.approvedProducts + res.data.pendingProducts
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
    { name: "Approved Products", value: stats.accepted, icon: <FiCheckCircle /> },
    { name: "Pending Products", value: stats.pending, icon: <FiClock /> },
    { name: "Total Reviews", value: stats.totalReviews, icon: <FiMessageSquare /> },
    { name: "Registered Users", value: stats.totalUsers, icon: <FiUsers /> }
  ];

  const COLORS = ["#4ade80", "#fbbf24", "#60a5fa", "#a78bfa"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform statistics at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4 text-green-600">
              <FiPackage className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProducts.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        {pieData.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div 
                className="p-3 rounded-lg mr-4" 
                style={{ backgroundColor: `${COLORS[index]}20`, color: COLORS[index] }}
              >
                {React.cloneElement(item.icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{item.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {item.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Pie Chart */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-10">
        <h2 className="text-xl font-semibold text-center mb-6">Platform Distribution</h2>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}\n${(percent * 100).toFixed(1)}% (${pieData.find(d => d.name === name)?.value.toLocaleString()})`
                }
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value.toLocaleString(), name]}
                contentStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                height={50}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Statistics Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Approval Rate</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalProducts > 0 
                ? `${Math.round((stats.accepted / stats.totalProducts) * 100)}%` 
                : '0%'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.accepted.toLocaleString()} approved out of {stats.totalProducts.toLocaleString()} products
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Reviews per Product</h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.accepted > 0 
                ? (stats.totalReviews / stats.accepted).toFixed(1) 
                : '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.totalReviews.toLocaleString()} reviews across {stats.accepted.toLocaleString()} products
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Products per User</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalUsers > 0 
                ? (stats.totalProducts / stats.totalUsers).toFixed(1) 
                : '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.totalProducts.toLocaleString()} products by {stats.totalUsers.toLocaleString()} users
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-4">Product Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Approval Rate</span>
              <span className="font-medium">
                {stats.totalProducts > 0 
                  ? `${Math.round((stats.accepted / stats.totalProducts) * 100)}%` 
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Review</span>
              <span className="font-medium">
                {stats.pending.toLocaleString()} ({stats.totalProducts > 0 
                  ? `${Math.round((stats.pending / stats.totalProducts) * 100)}%` 
                  : '0%'})
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-4">Community Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Reviews per Product</span>
              <span className="font-medium">
                {stats.accepted > 0 
                  ? (stats.totalReviews / stats.accepted).toFixed(1) 
                  : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Products per User</span>
              <span className="font-medium">
                {stats.totalUsers > 0 
                  ? (stats.totalProducts / stats.totalUsers).toFixed(1) 
                  : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;