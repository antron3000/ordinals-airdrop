const { exec } = require('child_process');
const fs = require('fs');

// Define paths to wallet and the directory containing JSON files
const walletName = 'ord';
const jsonDirPath = './'; // Directory containing JSON files

// Function to execute shell commands
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error}`);
                return;
            }
            if (stderr) {
                reject(`Stderr: ${stderr}`);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

// Function to process a transaction hex
async function processTransactionHex(transactionHex, description, imageName) {
    try {
        // Sign the transaction
        const signCommand = `bitcoin-cli -testnet -rpcwallet=${walletName} signrawtransactionwithwallet ${transactionHex}`;
        const signedTx = await executeCommand(signCommand);
        const signedHex = JSON.parse(signedTx).hex; // Ensure JSON structure matches output

        // Send the transaction
        const sendCommand = `bitcoin-cli -testnet -rpcwallet=${walletName} sendrawtransaction ${signedHex}`;
        const txId = await executeCommand(sendCommand);

        console.log(`${description} transaction for ${imageName} successfully sent. TXID: ${txId}`);
    } catch (error) {
        console.error(`Error processing the ${description} for ${imageName}: ${error}`);
    }
}

// Main function to run the sequence for each image
async function main() {
    try {
        for (let i = 0; i < 10; i++) {
            const jsonFilePath = `${jsonDirPath}${i}.json`; // Construct the path to each JSON file
            const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
            const commitHex = jsonData.commit_hex;
            const revealHex = jsonData.reveal_hex;
            const imageName = `${i}.png`;

            // Process commit_hex first
            await processTransactionHex(commitHex, "Commit", imageName);

            // Process reveal_hex next
            await processTransactionHex(revealHex, "Reveal", imageName);
        }
    } catch (error) {
        console.error(`An overall error occurred: ${error}`);
    }
}

// Execute the main function
main();
