const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to scrape data
async function scrapeData() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.ord.io/?childrenOf=9d71fc47daede70dde1dd4af7cdfffac18627f797d7542880ec6db2107ad62b6i0');

    // Scroll to the bottom of the page to load all content
    await autoScroll(page);

    // Extract links
    const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors.map(anchor => anchor.getAttribute('href'));
    });

    const filteredLinks = links.filter(link => link.startsWith('/7'));
    
    // Write data to a JSON file
    fs.writeFileSync('scraped_data.json', JSON.stringify(filteredLinks, null, 2));
    
    console.log('Data has been scraped and saved to scraped_data.json');
    
    await browser.close();
}

// Helper function to continuously scroll to the bottom of the page until all content is loaded
// Helper function to continuously scroll to the bottom of the page until all content is loaded
async function autoScroll(page) {
    let lastHeight = await page.evaluate('document.body.scrollHeight');
    let scrollAttempts = 0;
    const maxScrollAttempts = 50; // Adjust the maximum number of scroll attempts as needed

    while (scrollAttempts < maxScrollAttempts) {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for the content to load
        
        const newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === lastHeight) {
            // No new content loaded, stop scrolling
            break;
        }
        lastHeight = newHeight;
        scrollAttempts++;
    }
}


// Call the function to scrape data
scrapeData();
