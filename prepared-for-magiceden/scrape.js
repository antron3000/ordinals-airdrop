const puppeteer = require("puppeteer");
const fs = require("fs");

// Function to scrape data
async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const totalPages = 199;
  const baseUrl = "https://ordinals.com/children/9d71fc47daede70dde1dd4af7cdfffac18627f797d7542880ec6db2107ad62b6i0/";

  const links = [];

  for (let i = 0; i < totalPages; i++) {
    const pageUrl = `${baseUrl}${i}`;
    await page.goto(pageUrl, {timeout:60000});
  
    // Extract links from the current page
    const pageLinks = await page.evaluate(() => {
      const links = [];
      const anchors = document.querySelectorAll("a");
      anchors.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        // Check if href contains "inscription" and extract the value after it
        const match = href.match(/inscription\/([^\/]+)/);
        if (match && match[1] !== "9d71fc47daede70dde1dd4af7cdfffac18627f797d7542880ec6db2107ad62b6i0") {
          links.push(match[1]);
        }
      });
      return links;
    });
    console.log(`Page ${i + 1} scraped.`); // Adjusted index to start from 0
    // Add pageLinks to the links array
    links.push(...pageLinks);
  

  }
  

  // Write data to a JSON file
  fs.writeFileSync("scraped_data.json", JSON.stringify(links, null, 2));
  console.log("Data has been scraped and saved to scraped_data.json");

  await browser.close();
}

// Call the function to scrape data
module.exports = {
  scrapeData: scrapeData
};
