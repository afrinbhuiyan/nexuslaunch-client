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
import useAuth from "../../hooks/useAuth";

const DashboardHome = () => {
  const { user, role } = useAuth();

  // Common stats for all roles
  const commonStats = [
    {
      title: "Profile Completion",
      value: "85%",
      icon: <FiUsers className="text-blue-500" />,
      link: "/dashboard/profile",
    },
  ];

  // User-specific stats
  const userStats = [
    {
      title: "My Products",
      value: "12",
      icon: <FiPackage className="text-green-500" />,
      link: "/dashboard/my-products",
    },
    {
      title: "Add New Product",
      value: "+ Create",
      icon: <FiPlus className="text-purple-500" />,
      link: "/dashboard/add-product",
    },
    {
      title: "Pending Approvals",
      value: "3",
      icon: <FiClock className="text-yellow-500" />,
      link: "/dashboard/my-products",
    },
  ];

  // Moderator-specific stats
  const moderatorStats = [
    {
      title: "Products to Review",
      value: "24",
      icon: <FiFileText className="text-indigo-500" />,
      link: "/dashboard/review-products",
    },
    {
      title: "Reported Contents",
      value: "7",
      icon: <FiAlertCircle className="text-red-500" />,
      link: "/dashboard/reported-contents",
    },
    {
      title: "Approved Today",
      value: "15",
      icon: <FiCheckCircle className="text-green-500" />,
      link: "/dashboard/review-products",
    },
  ];

  // Admin-specific stats
  const adminStats = [
    {
      title: "Total Users",
      value: "1,243",
      icon: <FiUsers className="text-blue-500" />,
      link: "/dashboard/manage-users",
    },
    {
      title: "Platform Statistics",
      value: "View",
      icon: <FiPieChart className="text-purple-500" />,
      link: "/dashboard/statistics",
    },
    {
      title: "Active Coupons",
      value: "8",
      icon: <FiTag className="text-green-500" />,
      link: "/dashboard/manage-coupons",
    },
  ];

  // Combine stats based on role
  const getStats = () => {
    let stats = [...commonStats];
    if (role === "user") stats = [...stats, ...userStats];
    if (role === "moderator") stats = [...stats, ...moderatorStats];
    if (role === "admin") stats = [...stats, ...adminStats];
    return stats;
  };

  // Recent activities data
  const activities = [
    {
      id: 1,
      action: "Product 'Nexus Phone X' approved",
      time: "2 hours ago",
      link: "#",
    },
    { id: 2, action: "New review received", time: "5 hours ago", link: "#" },
    { id: 3, action: "Profile updated", time: "1 day ago", link: "#" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.displayName || "User"}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {getStats().map((stat, index) => (
          <Link
            to={stat.link}
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex-shrink-0 mt-1 mr-3 w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <Link
                to={activity.link}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {role === "user" && (
            <>
              <Link
                to="/dashboard/add-product"
                className="flex items-center p-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <FiPlus className="mr-3" />
                <span>Add New Product</span>
              </Link>
              <Link
                to="/dashboard/profile"
                className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FiUsers className="mr-3" />
                <span>Update Profile</span>
              </Link>
            </>
          )}
          {role === "moderator" && (
            <>
              <Link
                to="/dashboard/review-products"
                className="flex items-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <FiFileText className="mr-3" />
                <span>Review Products</span>
              </Link>
              <Link
                to="/dashboard/reported-contents"
                className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FiAlertCircle className="mr-3" />
                <span>Check Reports</span>
              </Link>
            </>
          )}
          {role === "admin" && (
            <>
              <Link
                to="/dashboard/manage-users"
                className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FiUsers className="mr-3" />
                <span>Manage Users</span>
              </Link>
              <Link
                to="/dashboard/statistics"
                className="flex items-center p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <FiPieChart className="mr-3" />
                <span>View Statistics</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
