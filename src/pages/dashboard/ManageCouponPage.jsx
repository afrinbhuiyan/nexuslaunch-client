import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";

const ManageCouponPage = () => {
  const axiosSecure = useAxiosSecure();
  const axios = useAxios()
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount: "",
    expiry: "",
  });

  const fetchCoupons = async () => {
    const res = await axiosSecure.get("/api/coupons");
    setCoupons(res.data);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    await axios.post("/api/coupons", form);
    Swal.fire("Success!", "Coupon added!", "success");
    fetchCoupons();
    setForm({ code: "", description: "", discount: "", expiry: "" });
  };

  const handleDelete = async (id) => {
    await axiosSecure.delete(`/api/coupons/${id}`);
    Swal.fire("Deleted!", "Coupon removed", "success");
    fetchCoupons();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🎟️ Manage Coupons</h2>

      {/* Add Coupon Form */}
      <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          className="input input-bordered"
          value={form.code}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="input input-bordered"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount Amount (%)"
          className="input input-bordered"
          value={form.discount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="expiry"
          className="input input-bordered"
          value={form.expiry}
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary md:col-span-2">Add Coupon</button>
      </form>

      {/* Display Coupon List */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Discount (%)</th>
              <th>Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>{coupon.description}</td>
                <td>{coupon.discount}</td>
                <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="btn btn-sm btn-error"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCouponPage;
