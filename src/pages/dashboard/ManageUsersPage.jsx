import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/api/users");
        setUsers(res.data);
      } catch {
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, [axiosSecure]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosSecure.patch(`/api/users/role/${userId}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch {
      toast.error("Failed to update role");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">👥 Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role || "user"}</td>
                <td className="p-3 space-x-2">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleRoleChange(user._id, "admin")}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Make Admin
                    </button>
                  )}
                  {user.role !== "moderator" && (
                    <button
                      onClick={() => handleRoleChange(user._id, "moderator")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Make Moderator
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;
