import React from 'react';
import FeaturedProducts from '../components/products/FeaturedProducts';
import TrendingProducts from '../components/products/TrendingProducts';

const Home = () => {
    return (
        <div>
            <FeaturedProducts/>
            <TrendingProducts/>
        </div>
    );
};

export default Home;