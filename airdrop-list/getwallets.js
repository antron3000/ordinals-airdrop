const fs = require('fs');
const path = require('path');

// Function to read a JSON file and parse it
function readJsonFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Function to extract unique wallets
function extractWallets(data) {
    const wallets = new Set(); // Use a Set to ensure uniqueness
    data.forEach(item => wallets.add(item.wallet));
    return Array.from(wallets); // Convert Set back to Array
}

// Function to save wallets to a file
function saveWalletsToFile(wallets) {
    fs.writeFile('wallets.json', JSON.stringify(wallets, null, 2), err => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File has been saved.');
        }
    });
}

// Main function to process all files
async function processFiles() {
    const allWallets = new Set();
    const fileNames = ['btcpuppets.json', 'nodemonkes.json', 'noderocks.json', 'quantumcats.json', 'wizards.json','shrooms1.json','runes.json','btcmachine.json'];
    
    for (let fileName of fileNames) {
        try {
            const filePath = path.join(__dirname, fileName);
            const fileData = await readJsonFile(filePath);
            const wallets = extractWallets(fileData);
            wallets.forEach(wallet => allWallets.add(wallet));
        } catch (error) {
            console.error(`Failed to process file ${fileName}:`, error);
        }
    }

    saveWalletsToFile(Array.from(allWallets)); // Convert Set back to Array for JSON serialization
}

processFiles();
