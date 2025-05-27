import React from 'react';
import { useLocation } from 'react-router-dom';
import './ProductComparison.css';

const ProductComparison = () => {
  const location = useLocation();
  const { product } = location.state || {};

  const platforms = [
    {
      name: 'Amazon',
      price: product?.amazonPrice || 'N/A',
      link: product?.amazonLink
    },
    {
      name: 'Flipkart',
      price: product?.flipkartPrice || 'N/A',
      link: product?.flipkartLink
    }
  ].filter(p => p.price !== 'N/A');

  // Find the lowest price
  const getNumericPrice = (price) => {
    return parseFloat(price.replace(/[₹,]/g, ''));
  };

  const lowestPricePlatform = platforms.reduce((min, p) => {
    if (p.price === 'N/A') return min;
    return getNumericPrice(p.price) < getNumericPrice(min.price) ? p : min;
  }, platforms[0]);

  const handleBuyNow = (platformUrl) => {
    if (platformUrl) {
      window.open(platformUrl, '_blank');
    }
  };

  if (!product) {
    return <div>No product data available</div>;
  }

  return (
    <div className="comparison-container">
      <div className="product-content">
        <div className="product-main">
          <img src={product?.image} alt={product?.name} className="product-image" />
          <h1 className="product-title">{product?.name}</h1>
        </div>

        <div className="price-overview">
          <h2>Price Comparison</h2>
          <div className="price-cards">
            {platforms.map((platform) => (
              <div 
                key={platform.name} 
                className={`price-card ${platform === lowestPricePlatform ? 'lowest-price' : ''}`}
              >
                <div className="platform-name">{platform.name}</div>
                <div className="platform-price">{platform.price}</div>
                <button
                  onClick={() => handleBuyNow(platform.link)}
                  className="view-btn"
                >
                  VIEW
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;