import React from 'react';
import FeaturedProducts from '../components/products/FeaturedProducts';
import TrendingProducts from '../components/products/TrendingProducts';
import CouponSlider from '../components/CouponSlider';

const Home = () => {
    return (
        <div>
            <FeaturedProducts/>
            <TrendingProducts/>
            <div>
                <h1>Hiiiiiiiiiiiiiiiiiiiiiiii</h1>
                <CouponSlider/>
            </div>
        </div>
    );
};

export default Home;