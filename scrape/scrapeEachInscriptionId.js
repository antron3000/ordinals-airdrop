const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapePageContent(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        // Wait for the content to load
        await page.waitForSelector('body');

        // Extract page content
        const pageContent = await page.evaluate(() => {
            const content = document.body.innerText;
            return content;
        });

        await browser.close();
        return pageContent;
    } catch (error) {
        console.error('Error during scraping:', error);
        return null;
    }
}

function extractId(content) {
    const regex = /id\s*(\w+)/i;
    const match = content.match(regex);
    if (match && match.length > 1) {
        return match[1];
    }
    return null;
}

async function saveResultsFromJson(jsonFilePath, outputFilePath) {
    try {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        const results = [];
        const baseUrl = 'https://ordinals.com/inscription';
        for (const path of jsonData) {
            const url = `${baseUrl}${path}`;
            const content = await scrapePageContent(url);
            if (content) {
                const id = extractId(content);
                if (id) {
                    results.push({ url: url, id: id });
                    console.log(`Processed URL: ${url}`);
                } else {
                    console.log(`Failed to extract ID for URL: ${url}`);
                }
            } else {
                console.log(`Failed to scrape content for URL: ${url}`);
            }
        }
        fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2));
        console.log('Results saved to JSON file:', outputFilePath);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Example usage
saveResultsFromJson('scraped_data.json', 'results.json');
