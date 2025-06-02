import React from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAllPlatforms } from '../services/api';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    console.log('=== Compare Prices Clicked ===');
    console.log('Product Details:', {
      name: product.name,
      platform: product.platform,
      category: product.category,
      price: product.price
    });

    // Store product data in localStorage synchronously
    localStorage.setItem('selectedProduct', JSON.stringify(product));

    // Determine the route based on the product category
    let route;
    const currentUrl = window.location.pathname;
    console.log('Current URL:', currentUrl);

    if (currentUrl.includes('/category/beauty') || product.category === 'beauty') {
      route = '/beauty-comparison';
      console.log('Routing to beauty comparison');
    } else if (product.category === 'travel') {
      route = '/travel-comparison';
      console.log('Routing to travel comparison');
    } else {
      route = '/product-comparison';
      console.log('Routing to product comparison');
    }

    console.log('Final route decision:', route);
    console.log('Full URL to open:', `${window.location.origin}${route}`);

    // Open the appropriate route in a new tab
    window.open(`${window.location.origin}${route}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">{product.price}</p>
      <button 
        onClick={handleViewProduct}
        className="product-link"
      >
        Compare Prices
      </button>
    </div>
  );
};

export default ProductCard;
