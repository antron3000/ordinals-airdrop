const fs = require("fs");
const puppeteer = require("puppeteer");

async function scrapePageContent(browser, url) {
  try {
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the content to load
    await page.waitForSelector("main");

    // Extract page content from the main tag
    const pageContent = await page.evaluate(() => {
      // Extract all text content from the main tag
      const mainContent = document.querySelector("main").innerText;
      return mainContent;
    });

    await page.close();
    return pageContent;
  } catch (error) {
    console.error("Error during scraping:", error);
    return null;
  }
}

// Function to extract specific values from the text content
function extractValues(content) {
  const data = content.split("\n").filter((line) => line.trim() !== "");
  const values = {
    id: null,
    metadata: {
      name: null,
      batch: "0",
    },
  };
  for (let i = 0; i < data.length; i++) {
    const line = data[i].trim();
    if (line.startsWith("id")) {
      values["id"] = data[i + 1];
    } else if (line.startsWith("name")) {
      values["metadata"]["name"] = data[i + 1];
    } else if (line.startsWith("batch")) {
      values["metadata"]["batch"] = data[i + 1];
    }
  }
  return values;
}

async function scrapeWithRetry(browser, url, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const content = await scrapePageContent(browser, url);
      if (content) {
        return content;
      } else {
        console.log(`Failed to scrape content for ${url}.`);
        return null;
      }
    } catch (error) {
      console.error(`Error scraping content for ${url}:`, error);
      attempt++;
      if (attempt === retries) {
        console.error(`Exceeded maximum retries for ${url}. Skipping...`);
        return null;
      }
      console.log(`Retrying scraping for ${url}... Attempt ${attempt}/${retries}`);
      // Wait for some time before retrying
      await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust the timeout as needed
    }
  }
}

// Read the JSON file containing list of URLs
const urls = JSON.parse(fs.readFileSync("error_ids.json"));

(async () => {
  const browser = await puppeteer.launch();
  const batchSize = 500;
  const totalUrls = urls.length;
  const errorIds = [];
  let allExtractedValues = [];

  for (let i = 0; i < totalUrls; i += batchSize) {
    const batchUrls = urls.slice(i, i + batchSize);
    console.log(
      `Processing URLs ${i + 1} to ${i + batchUrls.length} out of ${totalUrls}`
    );

    const scrapingTasks = batchUrls.map(async (url, index) => {
      try {
        const content = await scrapeWithRetry(
          browser,
          `https://ordinals.com/inscription/${url}`
        );
        if (content) {
          // Extract specific values
          const extractedValues = extractValues(content);
          return extractedValues;
        } else {
          console.log(`Failed to scrape content for ${url}.`);
          errorIds.push(url);
          return null;
        }
      } catch (error) {
        console.error(`Error scraping content for ${url}:`, error);
        errorIds.push(url);
        return null;
      }
    });

    const batchExtractedValues = await Promise.all(scrapingTasks);
    allExtractedValues = allExtractedValues.concat(
      batchExtractedValues.filter((value) => value !== null)
    );
  }

  // Write all extracted values to a single JSON file
  fs.writeFileSync(
    "all_extracted_data3.json",
    JSON.stringify(allExtractedValues, null, 2)
  );

  // Write error IDs to a separate JSON file
  fs.writeFileSync("error_ids1.json", JSON.stringify(errorIds, null, 2));

  browser.close();
  console.log(
    `All URLs processed and data has been saved. Error IDs are saved in error_ids.json`
  );
})();
