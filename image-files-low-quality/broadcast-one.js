const { exec } = require('child_process');
const fs = require('fs');

// Define paths to wallet and JSON file
const walletName = 'ord';
const jsonFilePath = './1.json'; // Adjust the path as needed

// Function to execute shell commands
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error: ${error}`);
            }
            if (stderr) {
                return reject(`Stderr: ${stderr}`);
            }
            resolve(stdout.trim());
        });
    });
}

// Function to process a transaction hex
async function processTransactionHex(transactionHex, description) {
    try {
        // Sign the transaction
        const signCommand = `bitcoin-cli -testnet -rpcwallet=${walletName} signrawtransactionwithwallet ${transactionHex}`;
        const signedTx = await executeCommand(signCommand);
        const signedHex = JSON.parse(signedTx).hex; // Ensure JSON structure matches output

        // Send the transaction
        const sendCommand = `bitcoin-cli -testnet -rpcwallet=${walletName} sendrawtransaction ${signedHex}`;
        const txId = await executeCommand(sendCommand);

        console.log(`${description} transaction successfully sent. TXID: ${txId}`);
    } catch (error) {
        console.error(`An error occurred while processing the ${description}: ${error}`);
    }
}

// Main function to run the sequence
async function main() {
    try {
        // Read the JSON file to get transaction hexes
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        const commitHex = jsonData.commit_hex;
        const revealHex = jsonData.reveal_hex;

        // Process commit_hex
        await processTransactionHex(commitHex, "Commit");

        // Process reveal_hex
        await processTransactionHex(revealHex, "Reveal");
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

// Execute the main function
main();
