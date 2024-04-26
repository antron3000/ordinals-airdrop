const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const fetchMetadata = async (inscriptionID) => {
    const url = `https://ordinals.com/inscription/${inscriptionID}`;
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let metadata = {};

        // Find the metadata specifically for 'name' and 'batch'
        const dl = $('dt:contains("name")').next('dd').parent('dl');
        const nameText = $(dl).find('dt:contains("name")').next('dd').text().trim();
        const batchText = $(dl).find('dt:contains("batch")').next('dd').text().trim();

        // Only include 'name' and 'batch' if they are not empty
        if (nameText) {
            metadata['name'] = nameText;
        }
        if (batchText) {
            metadata['batch'] = batchText;
        }

        return metadata;
    } catch (error) {
        console.error(`Failed to fetch metadata for ID ${inscriptionID}: ${error}`);
        return {};
    }
};

const processFiles = async (fileNames) => {
    for (const fileName of fileNames) {
        const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        const enrichedData = [];
        for (const item of data) {
            const metadata = await fetchMetadata(item.id);
            if (metadata.name || metadata.batch) {  // Include only if metadata is not empty
                enrichedData.push({
                    id: item.id,
                    metadata
                });
            }
        }
        fs.writeFileSync(`output_${fileName}`, JSON.stringify(enrichedData, null, 4));
    }
};

processFiles(['mutants.json', 'heroes.json']);
