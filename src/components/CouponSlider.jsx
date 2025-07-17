import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import useAxios from "../hooks/useAxios";

const CouponSlider = () => {
  const axios = useAxios();
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    axios.get("/api/coupons/valid").then((res) => setCoupons(res.data));
  }, [axios]);

  if (coupons.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto my-16 px-4">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#766df4] to-[#958ef4]"
      >
        🎉 Exclusive Coupon Offers
      </motion.h2>
      
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="pb-12"
      >
        {coupons.map((coupon) => (
          <SwiperSlide key={coupon._id}>
            <motion.div
              whileHover={{ y: -5 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-dashed border-[#766df4]/30 mx-2 mb-11"
            >
              {/* Ribbon */}
              <div className="absolute top-0 right-4 bg-[#766df4] text-white px-3 py-1 text-sm font-bold clip-path-ribbon">
                {coupon.discount}% OFF
              </div>
              
              {/* Coupon Content */}
              <div className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#766df4]/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#766df4]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#766df4] mb-2 font-mono tracking-wider">
                  {coupon.code}
                </h3>
                
                <p className="text-gray-600 mb-4">{coupon.description}</p>
                
                <div className="flex justify-between items-center text-sm bg-[#766df4]/5 p-3 rounded-lg">
                  <span className="text-gray-500">Valid until:</span>
                  <span className="font-medium text-[#766df4]">
                    {new Date(coupon.expiry).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Coupon Perforation */}
              <div className="absolute bottom-0 left-0 right-0 h-4 flex justify-between px-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-[#766df4]/20 rounded-full"></div>
                ))}
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CouponSlider;