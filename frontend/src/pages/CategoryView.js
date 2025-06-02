import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProducts, searchZomato, searchSwiggy } from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import './CategoryView.css';

const validPlatforms = ['nykaa', 'amazon', 'flipkart', 'myntra', 'croma', 'zomato', 'swiggy'];

const categoryPlatforms = {
  products: ['amazon', 'flipkart'],
  food: ['zomato', 'swiggy'],
  beauty: ['nykaa', 'myntra'],
  travel: ['croma'],
};

const getCategoryFromPlatform = (platform) => {
  for (const [category, platforms] of Object.entries(categoryPlatforms)) {
    if (platforms.includes(platform)) {
      return category;
    }
  }
  return 'products'; // default category
};

const CategoryView = () => {
  const { platform } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [comparisonList, setComparisonList] = useState([]);
  const [displayMode, setDisplayMode] = useState('random'); // Default display mode set to 'random'
  const [location, setLocation] = useState('');
  const [foodResults, setFoodResults] = useState([]);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  useEffect(() => {
    if (location && platform === 'food') {
      const fetchFoodData = async () => {
        try {
          const zomatoResults = await searchZomato(location);
          const swiggyResults = await searchSwiggy(location);
          setFoodResults([...zomatoResults, ...swiggyResults]);
        } catch (error) {
          console.error('Error fetching food data:', error);
        }
      };

      fetchFoodData();
    }
  }, [location, platform]);

  const handleMissingData = (product, platformName) => {
    return {
      name: product.name || 'No Name Available',
      rating: product.rating !== 'No rating' ? product.rating : 'Not Rated',
      image: product.image || 'https://via.placeholder.com/100',
      link: product.link || '#',
      price: product.price || 'Price not available',
      platform: platformName || 'Unknown',
    };
  };

  const fetchData = async () => {
    const platforms = categoryPlatforms[platform];
    if (!platforms) {
      setError(`Invalid category: ${platform}. Please select a valid category.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const allResults = await Promise.all(
        platforms.map(async (platformName) => {
          const data = await fetchProducts(platformName, query);
          return data.map((product) => handleMissingData(product, platformName));
        })
      );
      console.log('Fetched data:', allResults.flat()); // Log the fetched data for debugging
      setProducts(allResults.flat());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddToComparison = (product) => {
    setComparisonList((prev) => {
      if (prev.find((item) => item.name === product.name)) {
        return prev; // Avoid duplicates
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromComparison = (productName) => {
    setComparisonList((prev) => prev.filter((item) => item.name !== productName));
  };

  const getRandomizedProducts = (products) => {
    return [...products].sort(() => Math.random() - 0.5);
  };

  const filteredProducts = products.filter((product) => {
    if (filters.name && !product.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    if (filters.price && product.price > filters.price) {
      return false;
    }
    if (filters.platform && product.platform !== filters.platform) {
      return false;
    }
    return true;
  });

  const processedProducts = getRandomizedProducts(filteredProducts); // Always randomize products

  return (
    <div className="category-view">
      <h2>Search in {platform}</h2>
      <button onClick={() => navigate('/')}>Go Back to Home</button>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for items..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {platform === 'food' && (
        <div className="location-input">
          <label htmlFor="location">Enter your location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter your city or area"
          />
        </div>
      )}
      {platform === 'food' && foodResults.length > 0 && (
        <div>
          <h2>Food Results</h2>
          <ul>
            {foodResults.map((result, index) => (
              <li key={index}>{result.name} - {result.price}</li>
            ))}
          </ul>
        </div>
      )}
      <FilterBar onFilterChange={handleFilterChange} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className={`product-grid ${displayMode}`}> {/* Add dynamic class for styling */}
        {processedProducts.map((product, index) => (
          <div key={index} className="product-with-platform">
            <ProductCard
              product={{
                ...product,
                category: getCategoryFromPlatform(platform)
              }}
              onAddToComparison={() => handleAddToComparison(product)}
            />
            <p className="platform-name">Platform: {product.platform || 'Unknown'}</p>
          </div>
        ))}
      </div>
      {comparisonList.length > 0 && (
        <div className="comparison-section">
          <h3>Comparison List</h3>
          <div className="comparison-grid">
            {comparisonList.map((item, index) => (
              <div key={index} className="comparison-card">
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <p>{item.rating}</p>
                <button onClick={() => handleRemoveFromComparison(item.name)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryView;
