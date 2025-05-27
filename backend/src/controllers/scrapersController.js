const nykaaScraper = require('../scrapers/nykaaScraper');
const amazonScraper = require('../scrapers/amazonScraper');
const flipkartScraper = require('../scrapers/flipkartScraper');
const myntraScraper = require('../scrapers/myntraScraper');
const cromaScraper = require('../scrapers/cromaScraper');
const zomatoScraper = require('../scrapers/zomatoScraper');
const swiggyScraper = require('../scrapers/swiggyScraper');

// Controller functions for each scraper
const scrapeNykaa = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await nykaaScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Nykaa', error });
  }
};

const scrapeAmazon = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await amazonScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Amazon', error });
  }
};

const scrapeFlipkart = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await flipkartScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Flipkart', error });
  }
};

const scrapeMyntra = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await myntraScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Myntra', error });
  }
};

const scrapeCroma = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await cromaScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Croma', error });
  }
};

const scrapeZomato = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await zomatoScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Zomato', error });
  }
};

const scrapeSwiggy = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });
    const results = await swiggyScraper(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error scraping Swiggy', error });
  }
};

const searchAllPlatforms = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    console.log('Searching all platforms for query:', query);

    // Search all platforms in parallel    const results = await Promise.allSettled([
      amazonScraper(query).catch(err => {
        console.error('Amazon scraper error:', err);
        return [];
      }),
      flipkartScraper(query).catch(err => {
        console.error('Flipkart scraper error:', err);
        return [];
      }),
      myntraScraper(query).catch(err => {
        console.error('Myntra scraper error:', err);
        return [];
      }),
      cromaScraper(query).catch(err => {
        console.error('Croma scraper error:', err);
        return [];
      }),
      nykaaScraper(query).catch(err => {
        console.error('Nykaa scraper error:', err);
        return [];
      })
        return [];
      }),
      myntraScraper(query).catch(err => {
        console.error('Myntra scraper error:', err);
        return [];
      }),
      nykaaScraper(query).catch(err => {
        console.error('Nykaa scraper error:', err);
        return [];
      }),
      cromaScraper(query).catch(err => {
        console.error('Croma scraper error:', err);
        return [];
      })
    ]);

    const platformResults = {
      amazon: results[0].status === 'fulfilled' ? results[0].value : [],
      flipkart: results[1].status === 'fulfilled' ? results[1].value : [],
      myntra: results[2].status === 'fulfilled' ? results[2].value : [],
      nykaa: results[3].status === 'fulfilled' ? results[3].value : [],
      croma: results[4].status === 'fulfilled' ? results[4].value : []
    };

    console.log('Results from all platforms:', platformResults);

    res.status(200).json(platformResults);
  } catch (error) {
    console.error('Error in searchAllPlatforms:', error);
    res.status(500).json({ message: 'Error searching across platforms', error: error.message });
  }
};

module.exports = {
  scrapeNykaa,
  scrapeAmazon,
  scrapeFlipkart,
  scrapeMyntra,
  scrapeCroma,
  scrapeSwiggy,
  scrapeZomato,
  searchAllPlatforms
};
