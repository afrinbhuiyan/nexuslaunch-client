import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxios from "../../hooks/useAxios";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const stripe = useStripe();
  const elements = useElements();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/api/payment/subscription-status?email=${user.email}`)
        .then((res) => {
          setIsSubscribed(res.data?.isSubscribed);
        })
        .catch(() => toast.error("Failed to fetch subscription status"));
    }
  }, [user?.email, axiosSecure]);

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
        amount: 5 * 100, // $5 in cents
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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <img
        src={user?.photoURL}
        alt="User"
        className="w-24 h-24 rounded-full mx-auto"
      />
      <h2 className="text-xl font-semibold text-center mt-4">
        {user?.displayName}
      </h2>
      <p className="text-center text-gray-500">{user?.email}</p>

      {!isSubscribed && !showPaymentForm && (
        <button
          onClick={() => setShowPaymentForm(true)}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Subscribe $5
        </button>
      )}

      {showPaymentForm && (
        <form onSubmit={handleSubscribe} className="mt-4 space-y-4">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code (optional)"
            className="w-full border p-2 rounded"
          />
          <CardElement className="border p-2 rounded" />
          <button
            type="submit"
            disabled={loading || !stripe || !elements}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Processing..." : "Pay $5 and Subscribe"}
          </button>
        </form>
      )}

      {isSubscribed && (
        <p className="mt-4 text-center text-green-600 font-medium">
          Status: Verified ✅
        </p>
      )}
    </div>
  );
};

export default MyProfile;
