const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const fetchMetadata = async (inscriptionID) => {
    const url = `https://ordinals.com/inscription/${inscriptionID}`;
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let metadata = {};
        
        // Target only specific metadata entries: 'name' and 'batch'
        const dl = $('dt:contains("name")').next('dd').parent('dl');
        metadata['name'] = $(dl).find('dt:contains("name")').next('dd').text().trim();
        metadata['batch'] = $(dl).find('dt:contains("batch")').next('dd').text().trim();

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
            if (metadata.name || metadata.batch) {  // Only add entries with non-empty metadata
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
