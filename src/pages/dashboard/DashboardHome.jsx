import React from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiPlus,
  FiFileText,
  FiAlertCircle,
  FiUsers,
  FiPieChart,
  FiTag,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import useAuth from "../../hooks/useAuth";

const DashboardHome = () => {
  const { user, role } = useAuth();

  // Common stats
  const commonStats = [
    { title: "Profile", value: "View", icon: <FiUsers className="text-blue-500" />, link: "/dashboard/profile" },
  ];

  // Role-based stats
  const userStats = [
    { title: "My Products", value: "12", icon: <FiPackage className="text-green-500" />, link: "/dashboard/my-products" },
    { title: "Add New Product", value: "+ Create", icon: <FiPlus className="text-purple-500" />, link: "/dashboard/add-product" },
    { title: "Pending Approvals", value: "3", icon: <FiClock className="text-yellow-500" />, link: "/dashboard/my-products" },
  ];

  const moderatorStats = [
    { title: "Products to Review", value: "24", icon: <FiFileText className="text-indigo-500" />, link: "/dashboard/review-products" },
    { title: "Reported Contents", value: "7", icon: <FiAlertCircle className="text-red-500" />, link: "/dashboard/reported-contents" },
    { title: "Approved Today", value: "15", icon: <FiCheckCircle className="text-green-500" />, link: "/dashboard/review-products" },
  ];

  const adminStats = [
    { title: "Total Users", value: "1,243", icon: <FiUsers className="text-blue-500" />, link: "/dashboard/manage-users" },
    { title: "Platform Statistics", value: "View", icon: <FiPieChart className="text-purple-500" />, link: "/dashboard/statistics" },
    { title: "Active Coupons", value: "8", icon: <FiTag className="text-green-500" />, link: "/dashboard/manage-coupons" },
  ];

  const getStats = () => {
    let stats = [...commonStats];
    if (role === "user") stats = [...stats, ...userStats];
    if (role === "moderator") stats = [...stats, ...moderatorStats];
    if (role === "admin") stats = [...stats, ...adminStats];
    return stats;
  };

  // Sample chart data
  const productData = [
    { name: "Jan", Products: 4 },
    { name: "Feb", Products: 7 },
    { name: "Mar", Products: 3 },
    { name: "Apr", Products: 8 },
  ];

  const userDistribution = [
    { name: "Users", value: 1243 },
    { name: "Moderators", value: 12 },
    { name: "Admins", value: 3 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  // Recent activities
  const activities = [
    { id: 1, action: "Product 'Nexus Phone X' approved", time: "2 hours ago", link: "#" },
    { id: 2, action: "New review received", time: "5 hours ago", link: "#" },
    { id: 3, action: "Profile updated", time: "1 day ago", link: "#" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.displayName || "User"}!
        </h1>
        <p className="text-gray-600">Here's an overview of your dashboard.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {getStats().map((stat, index) => (
          <Link key={index} to={stat.link} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Monthly Product Stats</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Products" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">User Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={userDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label>
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0 mt-1 mr-3 w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <Link to={activity.link} className="text-blue-500 hover:text-blue-700 text-sm font-medium">View</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {role === "user" && (
            <>
              <Link to="/dashboard/add-product" className="flex items-center p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                <FiPlus className="mr-3" /> Add New Product
              </Link>
              <Link to="/dashboard/profile" className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <FiUsers className="mr-3" /> Update Profile / Subscribe
              </Link>
            </>
          )}
          {role === "moderator" && (
            <>
              <Link to="/dashboard/review-products" className="flex items-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                <FiFileText className="mr-3" /> Review Products
              </Link>
              <Link to="/dashboard/reported-contents" className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                <FiAlertCircle className="mr-3" /> Check Reports
              </Link>
              <Link to="/dashboard/profile" className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <FiUsers className="mr-3" /> View Profile
              </Link>
            </>
          )}
          {role === "admin" && (
            <>
              <Link to="/dashboard/manage-users" className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <FiUsers className="mr-3" /> Manage Users
              </Link>
              <Link to="/dashboard/statistics" className="flex items-center p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                <FiPieChart className="mr-3" /> View Statistics
              </Link>
              <Link to="/dashboard/profile" className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <FiUsers className="mr-3" /> View Profile
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
