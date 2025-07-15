import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import useAxiosSecure from "../hooks/useAxiosSecure";

const CouponSlider = () => {
  const axiosSecure = useAxiosSecure();
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    axiosSecure.get("/api/coupons/valid").then((res) => setCoupons(res.data));
  }, [axiosSecure]);

  console.log(coupons)



  if (coupons.length === 0) return null;

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-4 text-center">🎁 Active Coupon Offers</h2>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
      >
        {coupons.map((coupon) => (
          <SwiperSlide key={coupon._id}>
            <div className="bg-gradient-to-r from-purple-100 to-indigo-200 shadow-md p-6 rounded-xl text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-indigo-700">{coupon.code}</h3>
              <p className="text-gray-700 mt-2">{coupon.description}</p>
              <p className="text-lg font-semibold text-green-600 mt-2">
                🎉 {coupon.discount}% OFF
              </p>
              <p className="text-sm text-gray-500">
                Expiry: {new Date(coupon.expiry).toLocaleDateString()}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CouponSlider;
