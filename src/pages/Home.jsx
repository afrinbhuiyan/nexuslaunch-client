import React from 'react';
import FeaturedProducts from '../components/products/FeaturedProducts';
import TrendingProducts from '../components/products/TrendingProducts';
import CouponSlider from '../components/CouponSlider';
import Banner from '../components/Banner';

const Home = () => {
    return (
        <div>
            <Banner/>
            <FeaturedProducts/>
            <TrendingProducts/>
            <div>
                <CouponSlider/>
            </div>
        </div>
    );
};

export default Home;