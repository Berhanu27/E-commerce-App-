import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  // Pick the first image, or fallback if missing
  const productImage = image && image.length > 0 ? image[0] : '/fallback-image.png';

  return (
    <Link
      className="text-gray-700 cursor-pointer block"
      to={`/product/${id}`}
      aria-label={`View details for ${name}`}
    >
      <div className="overflow-hidden rounded-lg bg-gray-100">
        <img
          className="hover:scale-110 transition-transform duration-500 ease-in-out w-full object-cover"
          src={productImage}
          alt={name}
          loading="lazy"
        />
      </div>
      <p className="pt-3 pb-1 text-sm truncate">{name}</p>
      <p className="text-sm font-semibold text-gray-900">
        {currency}{price.toLocaleString()}
      </p>
    </Link>
  );
};

export default ProductItem;
