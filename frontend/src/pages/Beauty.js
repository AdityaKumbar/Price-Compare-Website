import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './CategoryView.css';

const Beauty = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBeautyProducts = async () => {
      try {
        const response = await fetchProducts('beauty');
        // Add category field to each product
        const productsWithCategory = response.map((product) => ({
          ...product,
          category: 'beauty',
        }));
        setProducts(productsWithCategory);
      } catch (error) {
        console.error('Error fetching beauty products:', error);
      }
    };

    fetchBeautyProducts();
  }, []);

  return (
    <div className="category-view">
      <h1>Beauty Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Beauty;
