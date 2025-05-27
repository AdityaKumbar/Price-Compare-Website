import React from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilterChange }) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search by name..."
        onChange={(e) => onFilterChange('name', e.target.value)}
      />
      <input
        type="number"
        placeholder="Max price..."
        onChange={(e) => onFilterChange('price', e.target.value)}
      />
      <select onChange={(e) => onFilterChange('platform', e.target.value)}>
        <option value="">All Platforms</option>
        <option value="nykaa">Nykaa</option>
        <option value="amazon">Amazon</option>
        <option value="flipkart">Flipkart</option>
        <option value="myntra">Myntra</option>
      </select>
    </div>
  );
};

export default FilterBar;
