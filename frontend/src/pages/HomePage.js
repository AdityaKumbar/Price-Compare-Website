import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Products', path: '/category/products' },
    { name: 'Food', path: '/category/food' },
    { name: 'Beauty', path: '/category/beauty' },
    { name: 'Travel', path: '/category/travel' },
  ];

  return (
    <div className="home-page">
      <h1>Welcome to Price Compare</h1>
      <div className="categories">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-card"
            onClick={() => navigate(category.path)}
          >
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
