const puppeteer = require('puppeteer');

const scrapeNykaa = async (query) => {
  if (!query) throw new Error("Missing search query");

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const url = `https://www.nykaa.com/search/result/?q=${encodeURIComponent(query)}`;
  console.log('Navigating to URL:', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  // Check for login modal and close it if it appears
  try {
    await page.waitForSelector('.login-modal', { timeout: 5000 });
    console.log('Login modal detected. Attempting to close it.');

    // Capture a screenshot before closing the login modal
    await page.screenshot({ path: 'nykaa_debug_before_login.png', fullPage: true });

    await page.click('.login-modal .close-button');

    // Capture a screenshot after attempting to close the login modal
    await page.screenshot({ path: 'nykaa_debug_after_login.png', fullPage: true });
  } catch (error) {
    console.log('No login modal detected.');
  }

  // Give the client-side scripts time to render (can adjust as needed)
  await new Promise(resolve => setTimeout(resolve, 5000)); // Adjusted wait time from 2000ms to 5000ms

  // Debugging: Log the page content to verify if product cards are present
  const pageContent = await page.content();
  console.log('Page Content Length:', pageContent.length);
  console.log('Page Content Snippet:', pageContent.slice(0, 500)); // Log a snippet of the page content

  // Capture a screenshot after navigating to the product page
  await page.screenshot({ path: 'nykaa_debug_product_page.png', fullPage: true });

  // Wait for product cards to load
  try {
    await page.waitForSelector('.css-12zjr3s', { timeout: 10000 }); // Adjusted selector for product cards
    console.log('Product cards loaded successfully.');
  } catch (error) {
    console.log('Product cards did not load within the timeout period.');
  }

  // Debugging log to inspect the DOM structure
  const domStructure = await page.evaluate(() => document.body.innerHTML);
  console.log('DOM Structure Snippet:', domStructure.slice(0, 2000)); // Log a larger snippet of the DOM structure

  // Debugging log to verify product card presence
  const productCards = await page.evaluate(() => document.querySelectorAll('.css-12zjr3s').length);
  console.log('Number of product cards detected:', productCards);

  // Scroll the page multiple times to trigger lazy loading
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 3000)); // Increased wait time for images to load
  }

  // Scrape product cards
  const products = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('.css-d5z3ro').forEach((el) => {
      const name = el.querySelector('.css-1rd7vky')?.innerText || 'No name';
      const price = el.querySelector('.css-111z9ua')?.innerText || 'No price';
      const imageTag = el.querySelector('.css-43m2vm img');
      const image = imageTag?.getAttribute('src') ||
                    imageTag?.getAttribute('data-src') ||
                    imageTag?.getAttribute('srcset')?.split(' ')[0] || null; // Check for additional attributes

      // Ensure the image URL is absolute
      const absoluteImage = image && image.startsWith('http') ? image : (image ? `https://www.nykaa.com${image}` : null);

      // Debugging log for missing images
      if (!absoluteImage) {
        console.log('Missing image for product:', {
          name,
          price,
          imageTag: imageTag?.outerHTML
        });
      }

      const link = el.querySelector('.css-qlopj4')?.href || null;

      items.push({ name, price, image: absoluteImage, link });
    });

    return items;
  });

  console.log('Scraped products from Nykaa:', products);

  await browser.close();
  return products;
};

module.exports = scrapeNykaa;
