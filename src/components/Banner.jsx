// components/Banner.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import banner from "../assets/img-01.png";
import useAuth from "../hooks/useAuth";

const Banner = () => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[#6055f2]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundPosition: "50% 50%",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex justify-center min-h-[80vh] px-4 py-20 sm:px-6 lg:px-8 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl text-center"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span className="block mb-3">Innovate, Showcase,</span>
            <span className="block text-[#ffef10] font-sans">
              Grow Your Digital Product
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-3xl mx-auto mt-6 text-xl leading-10 font-sans text-white"
          >
            Join the premier platform for developers to launch, get feedback,
            and accelerate growth for your digital creations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row"
          >
           { user ?  <Link
              to="/products"
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform bg-[#766df4] rounded-lg shadow-lg hover:bg-[#9189ff] hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Explore Marketplace
            </Link> : null}
            <Link
              to="/dashboard"
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform border-2 border-white rounded-lg hover:bg-white hover:bg-opacity-10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 hover:text-[#d4ca03]"
            >
              Submit Your Project
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16"
          >
            <p className="text-sm font-medium tracking-wider text-indigo-200 uppercase">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
              {["Google", "Microsoft", "Stripe", "Shopify", "Airbnb"].map(
                (company) => (
                  <div
                    key={company}
                    className="text-2xl font-bold text-white opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {company}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Angled Shape */}
      <div className="absolute -bottom-36 left-0 right-0 h-[190px] bg-white transform skew-y-[-3deg] origin-top-left z-[1]" />
    </section>
  );
};

export default Banner;
