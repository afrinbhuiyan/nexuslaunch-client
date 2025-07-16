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
    <div className="max-w-lg mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <img
            src={user?.photoURL}
            alt="User"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
          {isSubscribed && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800">{user?.displayName}</h2>
        <p className="text-blue-600 mt-1">{user?.email}</p>

        <div className="mt-8 w-full">
          {!isSubscribed && !showPaymentForm && (
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              Subscribe Premium ($5/month)
            </button>
          )}

          {showPaymentForm && (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Payment Details
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Coupon Code (optional)
                  </label>
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="e.g. WELCOME20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Card Information
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                          invalid: {
                            color: "#9e2146",
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !stripe || !elements}
                  className={`w-full py-3 rounded-xl font-medium shadow-md transition-all duration-300 ${
                    loading || !stripe || !elements
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Confirm Payment $5"
                  )}
                </button>
              </div>
            </form>
          )}

          {isSubscribed && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800">
                Premium Member
              </h3>
              <p className="text-green-600 mt-1">
                Thank you for your subscription!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;