const puppeteer = require('puppeteer');

const scrapeMyntra = async (query) => {
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

  const url = `https://www.myntra.com/${encodeURIComponent(query)}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  // Give the client-side scripts time to render (can adjust as needed)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Add a delay outside the page.evaluate function to ensure images are loaded
  await new Promise(resolve => setTimeout(resolve, 3000));

  const products = await page.evaluate(() => {
    const items = [];

    document.querySelectorAll('.product-base').forEach((el) => {
      const name = el.querySelector('.product-brand')?.innerText.trim() + ' ' +
                   el.querySelector('.product-product')?.innerText.trim() || 'No name'; // Combine brand and product name

      const price = el.querySelector('.product-discountedPrice')?.innerText || 'No price';

      const pictureTag = el.querySelector('picture');
      const imgTag = pictureTag?.querySelector('img');
      const sourceTag = pictureTag?.querySelector('source');

      const image = imgTag?.getAttribute('src') ||
                    sourceTag?.getAttribute('srcset')?.split(' ')[0] || null; // Extract from `src` or `srcset`

      // Ensure the image URL is absolute
      const absoluteImage = image && image.startsWith('http') ? image : (image ? `https://www.myntra.com${image}` : null);

      // Debugging log for image extraction
      if (!absoluteImage) {
        console.log('Picture tag attributes:', pictureTag?.outerHTML);
      }

      const link = el.querySelector('a')?.href || '';

      items.push({ name, price, image: absoluteImage, link });
    });

    return items;
  });

  console.log('Scraped products from Myntra:', products);

  await browser.close();
  return products;
};

module.exports = scrapeMyntra;
