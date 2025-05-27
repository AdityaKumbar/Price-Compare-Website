import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAllPlatforms } from '../services/api';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewProduct = async () => {
    try {
      setIsLoading(true);
      
      // Extract key terms for better matching across platforms
      const searchTerms = product.name
        .toLowerCase()
        .match(/iphone \d+(?:e)?|(?:\d+)\s*gb|black|blue|teal/g) || [];
      
      const searchQuery = searchTerms.join(' ');
      console.log('Searching with terms:', searchQuery);

      // Fetch prices from all platforms
      const allPlatformData = await searchAllPlatforms(searchQuery);
      console.log('Received platform data:', allPlatformData);      // Filter and match products based on key terms
      const matchedProducts = {
        amazon: allPlatformData.amazon?.filter(p => 
          searchTerms.every(term => p.name.toLowerCase().includes(term))
        )?.[0],
        flipkart: allPlatformData.flipkart?.filter(p => 
          searchTerms.every(term => p.name.toLowerCase().includes(term))
        )?.[0],
        myntra: allPlatformData.myntra?.filter(p => 
          searchTerms.every(term => p.name.toLowerCase().includes(term))
        )?.[0],
        croma: allPlatformData.croma?.filter(p => 
          searchTerms.every(term => p.name.toLowerCase().includes(term))
        )?.[0],
        nykaa: allPlatformData.nykaa?.filter(p => 
          searchTerms.every(term => p.name.toLowerCase().includes(term))
        )?.[0]
      };      // Combine the data
      const combinedData = {
        ...product,
        platform: product.platform || 'unknown',
        originalPrice: product.price,
        originalLink: product.link,
        amazonPrice: matchedProducts.amazon?.price || 'N/A',
        amazonLink: matchedProducts.amazon?.link || null,
        flipkartPrice: matchedProducts.flipkart?.price || 'N/A',
        flipkartLink: matchedProducts.flipkart?.link || null,
      };

      console.log('Combined data:', combinedData);
      setIsLoading(false);
      // Open in new tab
      const newWindow = window.open('/product-comparison', '_blank');
      newWindow.state = { product: combinedData };
    } catch (error) {
      console.error('Error fetching platform data:', error);
      setIsLoading(false);
      navigate('/product-comparison', { 
        state: { 
          product: {
            ...product,
            platform: product.platform || 'unknown',
            originalPrice: product.price,
            originalLink: product.link
          } 
        } 
      });
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">{product.price}</p>
      <button 
        onClick={handleViewProduct} 
        className={`product-link ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Compare Prices'}
      </button>
    </div>
  );
};

export default ProductCard;
