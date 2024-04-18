const { exec } = require('child_process');
const fs = require('fs');

// Define paths to wallet and JSON file
const walletName = 'ord';
const jsonFilePath = './0.json'; // Adjust the path as needed

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

// Main function to run the sequence
async function processTransaction() {
    try {
        // Read the JSON file to get commit_hex
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        const commitHex = jsonData.commit_hex;

        // Construct the commands
        const signCommand = `bitcoin-cli -testnet -rpcwallet=${walletName} signrawtransactionwithwallet ${commitHex}`;
        const signedTx = await executeCommand(signCommand);
        const signedHex = JSON.parse(signedTx).hex; // Ensure JSON structure matches output

        // Send the transaction
        const sendCommand = `bitcoin-cli -testnet -rpcwallet=${walletName} sendrawtransaction ${signedHex}`;
        const txId = await executeCommand(sendCommand);

        console.log(`Transaction successfully sent. TXID: ${txId}`);
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

// Execute the main function
processTransaction();
