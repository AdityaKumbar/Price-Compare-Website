import React, { useEffect, useState } from 'react';
import { searchAllPlatforms } from '../services/api';
import './ProductComparison.css';

const ProductComparison = () => {
  const [product, setProduct] = useState(null);
  const [otherResult, setOtherResult] = useState(null);

  useEffect(() => {
    // Load product from localStorage
    const stored = localStorage.getItem('selectedProduct');
    if (stored) {
      const prod = JSON.parse(stored);
      setProduct(prod);
      // Search the other platform if Flipkart or Amazon
      if (prod.platform === 'flipkart' || prod.platform === 'amazon') {
        searchAllPlatforms(prod.name, prod.platform).then(res => {
          console.log('API Response:', res); // Log the API response for debugging
          setOtherResult(res.otherPlatform[0] || null);
        });
      }
    }
  }, []);

  if (!product) return <div>Loading...</div>;

  // Determine which is lower
  const getPriceValue = (priceStr) => {
    if (!priceStr) return Infinity;
    return parseInt(priceStr.replace(/[^\d]/g, ''), 10);
  };
  const productPrice = getPriceValue(product.price);
  const otherPrice = getPriceValue(otherResult?.price);
  const isProductLower = productPrice <= otherPrice;

  return (
    <div className="comparison-container">
      <div className="product-content">
        <div className="product-main">
          <img src={product.image} alt={product.name} className="product-image" />
          <h1 className="product-title">{product.name}</h1>
        </div>
        <h2 style={{marginTop: 40}}>Price Comparison</h2>
        <div className="price-cards" style={{display: 'flex', gap: 32, marginTop: 16}}>
          {/* Original Platform */}
          <div className={`price-card${isProductLower ? ' lowest-price' : ''}`} style={{flex: 1}}>
            <div className="platform-name">{product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}</div>
            <div className="platform-price">{product.price || 'N/A'}</div>
            {product.link && (
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="view-btn">VIEW</a>
            )}
          </div>
          {/* Other Platform */}
          <div className={`price-card${!isProductLower ? ' lowest-price' : ''}`} style={{flex: 1}}>
            <div className="platform-name">{product.platform === 'flipkart' ? 'Amazon' : 'Flipkart'}</div>
            <div className="platform-price">{otherResult?.price || 'Loading...'}</div>
            {otherResult?.link && (
              <a href={otherResult.link} target="_blank" rel="noopener noreferrer" className="view-btn">VIEW</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;