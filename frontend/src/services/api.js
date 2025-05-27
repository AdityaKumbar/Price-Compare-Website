import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Fetch products from a specific scraper
export const fetchProducts = async (platform, query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/scrapers/${platform}`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching products from ${platform}:`, error);
    throw error;
  }
};

export const searchZomato = async (location) => {
  try {
    const formattedLocation = location.replace(/\s+/g, '-').toLowerCase(); // Format location for Zomato URL
    const url = `https://www.zomato.com/${formattedLocation}/restaurants?place_name=${encodeURIComponent(location)}&context=delivery&category=1`;
    console.log('Constructed Zomato URL:', url); // Debugging log

    const response = await fetch(`/api/zomato?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Zomato data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in searchZomato:', error);
    return [];
  }
};

export const searchSwiggy = async (location) => {
  try {
    const response = await fetch(`/api/swiggy?location=${encodeURIComponent(location)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Swiggy data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in searchSwiggy:', error);
    return [];
  }
};

// Search across all platforms
export const searchAllPlatforms = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/scrapers/search-all`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching across platforms:', error);
    throw error;
  }
};
