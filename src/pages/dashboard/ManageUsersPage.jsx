import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { FaUserShield, FaUserCog } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/api/users");
        setUsers(res.data.users);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [axiosSecure]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosSecure.patch(`/api/users/role/${userId}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getRoleBadge = (role) => {
    const roles = {
      admin: {
        color: "bg-purple-100 text-purple-800",
        icon: <FaUserShield className="mr-1" />,
      },
      moderator: {
        color: "bg-blue-100 text-blue-800",
        icon: <FaUserCog className="mr-1" />,
      },
      user: {
        color: "bg-green-100 text-green-800",
        icon: <FiUser className="mr-1" />,
      },
    };
    const roleData = roles[role] || roles.user;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleData.color}`}
      >
        {roleData.icon}
        {role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiUserCheck className="mr-2 text-indigo-600" />
            User Management
          </h2>
          <p className="text-gray-600">
            Manage all registered users and their roles
          </p>
        </div>
        <div className="relative mt-4 md:mt-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.photoURL || "/default-avatar.png"}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRoleBadge(user.role || "user")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleRoleChange(user._id, "admin")}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          title="Make Admin"
                        >
                          <FiShield className="mr-1" />
                          Admin
                        </button>
                      )}
                      {user.role !== "moderator" && (
                        <button
                          onClick={() =>
                            handleRoleChange(user._id, "moderator")
                          }
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="Make Moderator"
                        >
                          <FiUserCheck className="mr-1" />
                          Moderator
                        </button>
                      )}
                      <button
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        title="Edit User"
                      >
                        <FiEdit2 className="mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No users found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-indigo-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-indigo-800 flex items-center">
          <FiUserX className="mr-2" />
          Role Descriptions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FaUserShield className="text-purple-600 mr-2" />
              <h4 className="font-medium text-gray-900">Admin</h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Full access to all administrative functions including user
              management, content moderation, and system settings.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FaUserCog className="text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-900">Moderator</h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Can review and approve content, manage reports, but cannot modify
              user roles or system settings.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FiUser className="text-green-600 mr-2" />
              <h4 className="font-medium text-gray-900">Regular User</h4>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Standard platform access. Can submit content and interact with
              other users according to platform rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
