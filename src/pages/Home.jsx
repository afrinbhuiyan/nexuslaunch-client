import React from "react";
import FeaturedProducts from "../components/products/FeaturedProducts";
import TrendingProducts from "../components/products/TrendingProducts";
import CouponSlider from "../components/CouponSlider";
import Banner from "../components/Banner";
import WeeklySpotlight from "../components/WeeklySpotlight";
import TechStackTrends from "../components/products/TechStackTrends";
import HowItWorks from "../components/HowItWorks";
import KeyElementsSection from "../components/KeyElementsSection";
import Benefits from "../components/Benefits";
import Categories from "../components/Categories";

const Home = () => {
  return (
    <div>
      <Banner />
      <FeaturedProducts />
      <TrendingProducts />
      <Benefits />
      <Categories />
      {/* <WeeklySpotlight/> */}
      {/* <TechStackTrends/> */}
      <HowItWorks />
      <KeyElementsSection />
      <CouponSlider />
    </div>
  );
};

export default Home;
