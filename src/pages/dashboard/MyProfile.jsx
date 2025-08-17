import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const MyProfile = () => {
  const { user, role } = useAuth(); // ⬅️ এখন role ও নিচ্ছি
  const axiosSecure = useAxios();
  const stripe = useStripe();
  const elements = useElements();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  // শুধু user হলে subscription status চেক করবো
  useEffect(() => {
    if (role === "user" && user?.email) {
      axiosSecure
        .get(`/api/payment/subscription-status?email=${user.email}`)
        .then((res) => setIsSubscribed(res.data?.isSubscribed))
        .catch(() => toast.error("Failed to fetch subscription status"));
    }
  }, [user?.email, role, axiosSecure]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    try {
      const res = await axiosSecure.post("/api/payment/create-payment-intent", {
        amount: 5 * 100,
        email: user.email,
        couponCode: coupon.trim(),
      });

      const { clientSecret } = res.data;

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmResult.paymentIntent.status === "succeeded") {
        await axiosSecure.patch(`/api/payment/subscribe?email=${user.email}`);
        toast.success("Subscription successful!");
        setIsSubscribed(true);
        setShowPaymentForm(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <img
            src={user?.photoURL}
            alt="User"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">{user?.displayName}</h2>
        <p className="text-blue-600 mt-1">{user?.email}</p>
        <p className="text-gray-500 mt-1 capitalize">Role: {role}</p>

        {role === "user" ? (
          <div className="mt-8 w-full">
            {!isSubscribed && !showPaymentForm && (
              <button
                onClick={() => setShowPaymentForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Subscribe Premium ($5/month)
              </button>
            )}

            {showPaymentForm && (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Payment Details
                  </h3>
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                  />
                  <CardElement className="border border-gray-300 p-3 rounded-lg" />
                  <button
                    type="submit"
                    disabled={loading || !stripe || !elements}
                    className="w-full mt-4 py-3 rounded-xl bg-green-500 text-white font-medium"
                  >
                    {loading ? "Processing..." : "Confirm Payment $5"}
                  </button>
                </div>
              </form>
            )}

            {isSubscribed && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <h3 className="text-lg font-semibold text-green-800">
                  Premium Member
                </h3>
                <p className="text-green-600 mt-1">
                  Thank you for your subscription!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 bg-white shadow p-6 rounded-xl w-full">
            <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
            <p className="text-gray-600 mt-2">Phone: {user?.phone || "N/A"}</p>
            <p className="text-gray-600">Address: {user?.address || "N/A"}</p>
            <p className="text-gray-600">Role: {role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
