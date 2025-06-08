import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const platforms = ["Amazon", "Flipkart", "Myntra", "Nykaa"];

const HomePage = () => {
  const navigate = useNavigate();
  const [typedPlatform, setTypedPlatform] = useState("");
  const [platformIndex, setPlatformIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = platforms[platformIndex];
    let timeout;
    if (!deleting && charIndex <= current.length) {
      setTypedPlatform(current.slice(0, charIndex));
      timeout = setTimeout(() => setCharIndex(charIndex + 1), 120);
    } else if (deleting && charIndex >= 0) {
      setTypedPlatform(current.slice(0, charIndex));
      timeout = setTimeout(() => setCharIndex(charIndex - 1), 60);
    } else if (!deleting && charIndex > current.length) {
      timeout = setTimeout(() => setDeleting(true), 1000);
    } else if (deleting && charIndex < 0) {
      setDeleting(false);
      setPlatformIndex((platformIndex + 1) % platforms.length);
      setCharIndex(0);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, platformIndex]);

  return (
    <div className="home-page">
      {/* Title Section */}
      <h1 className="title">REAL TIME PRICE COMPARISON</h1>
      <p className="subtitle">
        Compare prices of products from <span className="typing-platform">{typedPlatform}<span className="typing-cursor">|</span></span>
      </p>

      {/* Categories Section */}
      <div className="categories">
        <div className="category-card" onClick={() => navigate('/category/products')}>
          PRODUCTS
        </div>
        <div className="category-card" onClick={() => navigate('/category/beauty')}>
          BEAUTY
        </div>
      </div>

      {/* Logos Section */}
      <div className="logos logos-rtl">
        <img src="/nykaa-1.svg" alt="Nykaa" className="logo" />
        <img src="/myntra-1.svg" alt="Myntra" className="logo" />
        <img src="/flipkart.svg" alt="Flipkart" className="logo" />
        <img src="https://cdn.iconscout.com/icon/free/png-256/amazon-1869030-1583154.png" alt="Amazon" className="logo" />
      </div>

      {/* How it works Section */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <img src="/1499.png" className="logo" style={{ width: "500px", height: "auto" }} />
      </div>
    </div>
  );
};

export default HomePage;
