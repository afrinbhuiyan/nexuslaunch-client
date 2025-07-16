import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import { FiPlus, FiTrash2, FiEdit2, FiCopy, FiCalendar, FiTag, FiPercent } from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";

const ManageCouponPage = () => {
  const axiosSecure = useAxiosSecure();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount: "",
    expiry: "",
    minPurchase: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  const fetchCoupons = async () => {
    try {
      const res = await axiosSecure.get("/api/coupons");
      setCoupons(res.data);
    } catch (error) {
      toast.error("Failed to load coupons");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosSecure.patch(`/api/coupons/${editingId}`, form);
        toast.success("Coupon updated successfully!");
      } else {
        await axiosSecure.post("/api/coupons", form);
        toast.success("Coupon added successfully!");
      }
      fetchCoupons();
      resetForm();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (coupon) => {
    setForm({
      code: coupon.code,
      description: coupon.description,
      discount: coupon.discount,
      expiry: coupon.expiry.split('T')[0],
      minPurchase: coupon.minPurchase || ""
    });
    setEditingId(coupon._id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/api/coupons/${id}`);
      toast.success("Coupon deleted successfully!");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const resetForm = () => {
    setForm({
      code: "",
      description: "",
      discount: "",
      expiry: "",
      minPurchase: ""
    });
    setEditingId(null);
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaTicketAlt className="mr-2 text-[#6055f2]" />
            Coupon Management
          </h2>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-lg ${viewMode === "grid" ? "bg-[#6055f2] text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded-lg ${viewMode === "table" ? "bg-[#6055f2] text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Coupon Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FiPlus className="mr-2" />
          {editingId ? "Edit Coupon" : "Add New Coupon"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
            <div className="relative">
              <input
                type="text"
                name="code"
                placeholder="SUMMER25"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={form.code}
                onChange={handleChange}
                required
              />
              <FiTag className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
            <div className="relative">
              <input
                type="number"
                name="discount"
                placeholder="25"
                min="1"
                max="100"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={form.discount}
                onChange={handleChange}
                required
              />
              <FiPercent className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              placeholder="Summer special discount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <div className="relative">
              <input
                type="date"
                name="expiry"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={form.expiry}
                onChange={handleChange}
                required
              />
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Minimum Purchase (optional)</label>
            <input
              type="number"
              name="minPurchase"
              placeholder="Minimum order value to apply"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={form.minPurchase}
              onChange={handleChange}
            />
          </div>

          <div className="flex space-x-3 md:col-span-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-[#6055f2] text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {editingId ? "Update Coupon" : "Add Coupon"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Coupons Display */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Active Coupons ({coupons.length})</h3>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <div 
                  key={coupon._id} 
                  className={`border rounded-xl p-5 relative overflow-hidden ${isExpired(coupon.expiry) ? 'border-red-200 bg-red-50' : 'border-purple-200 bg-purple-50'}`}
                >
                  {isExpired(coupon.expiry) && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Expired
                    </span>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-purple-800 flex items-center">
                        <FaTicketAlt className="mr-2" />
                        {coupon.code}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-[#6055f2]">{coupon.discount}%</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valid until:</span>
                      <span className="font-medium">{new Date(coupon.expiry).toLocaleDateString()}</span>
                    </div>
                    {coupon.minPurchase && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Min. purchase:</span>
                        <span className="font-medium">${coupon.minPurchase}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="p-2 text-gray-500 hover:text-[#6055f2] hover:bg-purple-100 rounded-full"
                      title="Copy code"
                    >
                      <FiCopy />
                    </button>
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No coupons available. Create your first coupon!
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Purchase</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr key={coupon._id} className={isExpired(coupon.expiry) ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaTicketAlt className="flex-shrink-0 h-5 w-5 text-[#6055f2] mr-2" />
                          <span className="font-medium">{coupon.code}</span>
                          {isExpired(coupon.expiry) && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#6055f2]">
                        {coupon.discount}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(coupon.expiry).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {coupon.minPurchase ? `$${coupon.minPurchase}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="text-[#6055f2] hover:text-purple-900"
                          title="Copy"
                        >
                          <FiCopy />
                        </button>
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No coupons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCouponPage;