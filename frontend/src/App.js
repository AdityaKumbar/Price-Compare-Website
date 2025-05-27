// Entry point for the React frontend
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryView from './pages/CategoryView';
import HomePage from './pages/HomePage';
import ProductComparison from './pages/ProductComparison';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:platform" element={<CategoryView />} />
        <Route path="/product-comparison" element={<ProductComparison />} />
      </Routes>
    </Router>
  );
}

export default App;
