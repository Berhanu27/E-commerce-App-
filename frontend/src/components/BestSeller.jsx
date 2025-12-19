import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products = [] } = useContext(ShopContext); // default to empty array
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        // Only run if products is an array and has items
        if (Array.isArray(products) && products.length > 0) {
            const bestProduct = products.filter(item => item.bestSeller);
            setBestSeller(bestProduct.slice(0, 5));
        }
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'BEST '} text2={'SELLER'} />

                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </p>

                <div className="w-20 h-px bg-gray-700 my-4"></div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {bestSeller.map((item) => (
                    <ProductItem
                        key={item._id} // ✅ use unique _id instead of index
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price} // make sure your backend sends these
                        
                    />
                ))}
            </div>
        </div>
    );
};

export default BestSeller;
