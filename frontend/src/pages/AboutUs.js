import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.css";

const AboutUs = () => {
  const navigate = useNavigate();

  const handleNavigateToAboutUs = () => {
    navigate('/about-us');
  };

  return (
    <div className="about-us">
      <h1>About Us</h1>
      <div className="cards-container">
        <div className="card">
          <h2>Our Mission</h2>
          <p>To help you save money by comparing prices across platforms effortlessly.</p>
        </div>
        <div className="card">
          <h2>Our Vision</h2>
          <p>To become the go-to platform for price comparison and smart shopping.</p>
        </div>
        <div className="card">
          <h2>Our Team</h2>
          <p>A group of passionate individuals dedicated to simplifying your shopping experience.</p>
        </div>
        <div className="card">
          <h2>Contact Us</h2>
        </div>
      </div>
      <button onClick={handleNavigateToAboutUs}>About Us</button>
    </div>
  );
};

export default AboutUs;
