const fs = require('fs');
const path = require('path');

// Function to read JSON from a file
function readJsonFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

// Function to check for duplicates
function checkForDuplicates(wallets) {
    const uniqueWallets = new Set();
    const duplicates = new Set();
    
    wallets.forEach(wallet => {
        if (uniqueWallets.has(wallet)) {
            duplicates.add(wallet);
        } else {
            uniqueWallets.add(wallet);
        }
    });

    if (duplicates.size > 0) {
        console.log("Duplicates found:", Array.from(duplicates));
    } else {
        console.log("No duplicates found.");
    }

    // Optionally save or handle the unique list further
    console.log("Unique wallets:", Array.from(uniqueWallets));
}

// Main function to process the wallet file
async function processWalletFile() {
    const filePath = path.join(__dirname, 'wallets.json');

    try {
        const wallets = await readJsonFile(filePath);
        checkForDuplicates(wallets);
    } catch (error) {
        console.error(`Failed to process file wallets.json:`, error);
    }
}

processWalletFile();
