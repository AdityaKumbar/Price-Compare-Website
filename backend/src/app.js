// Entry point for the backend application
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// ✅ CORS Configuration: Allow only your frontend
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://price-compare-website.vercel.app' // Your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/scrapers', require('./routes/scrapers'));

// Default route for root path
app.get('/', (req, res) => {
  res.send('Welcome to the Price Comparison API!');
});

// Test route to verify MongoDB connection
app.get('/api/test', (req, res) => {
  res.send('MongoDB connection is working!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
