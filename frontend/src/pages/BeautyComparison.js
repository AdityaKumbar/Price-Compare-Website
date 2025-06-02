import React, { useEffect, useState } from 'react';
import { searchAllPlatforms } from '../services/api';
import './BeautyComparison.css';

const BeautyComparison = () => {
  const [product, setProduct] = useState(null);
  const [otherResult, setOtherResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedProduct');
    if (stored) {
      const prod = JSON.parse(stored);
      setProduct(prod);

      if (prod.platform === 'myntra' || prod.platform === 'nykaa') {
        searchAllPlatforms(prod.name, prod.platform, 'beauty').then(res => {
          console.log('API Response:', res); // Debug log
          setOtherResult(res.otherPlatform[0] || null);
        }).catch(error => {
          console.error('Error fetching comparison data:', error);
          setOtherResult(null);
        });
      }
    }
  }, []);

  if (!product) return <div>Loading...</div>;

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
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onError={(e) => e.target.src = '/placeholder.png'}
          />
          <h1 className="product-title">{product.name}</h1>
        </div>
        <h2 style={{ marginTop: 40 }}>Price Comparison</h2>
        <div className="price-cards" style={{ display: 'flex', gap: 32, marginTop: 16 }}>
          {/* Original Platform */}
          <div className={`price-card${isProductLower ? ' lowest-price' : ''}`} style={{ flex: 1 }}>
            <div className="platform-name">
              {product.platform.charAt(0).toUpperCase() + product.platform.slice(1)}
              {isProductLower && <span className="best-price-badge">Best Price!</span>}
            </div>
            <div className="platform-price">{product.price || 'N/A'}</div>
            {product.link && (
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="view-btn">VIEW</a>
            )}
          </div>

          {/* Other Platform */}
          <div className={`price-card${!isProductLower && otherResult ? ' lowest-price' : ''}`} style={{ flex: 1 }}>
            <div className="platform-name">
              {product.platform === 'myntra' ? 'Nykaa' : 'Myntra'}
              {!isProductLower && otherResult && <span className="best-price-badge">Best Price!</span>}
            </div>
            <div className="platform-price">
              {otherResult?.price || 'Not available'}
            </div>
            {otherResult?.link && (
              <a href={otherResult.link} target="_blank" rel="noopener noreferrer" className="view-btn">VIEW</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeautyComparison;
