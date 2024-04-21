const { exec } = require('child_process');
const fs = require('fs');

// Define the base command and configuration
const baseCmd = `ord wallet --name exoHeroesTen cardinals`;

// Function to get UTXOs from the provided command
function getUTXOs() {
    return new Promise((resolve, reject) => {
        exec(baseCmd, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(stderr);
            }
            // Parse the output to extract UTXO data
            try {
                const utxos = JSON.parse(stdout).map(item => `${item.output}`);
                resolve(utxos);
            } catch (parseError) {
                reject(parseError);
            }
        });
    });
}

// Function to inscribe an image using a UTXO
function inscribeImage(imageFile, utxo) {
    const jsonOutputFile = imageFile.replace('.png', '.json');
    const inscribeCmd = `${baseCmd.replace('cardinals', `inscribe --file ${imageFile} --fee-rate 22 --coin-control --utxo ${utxo} --no-broadcast`)}`;

    return new Promise((resolve, reject) => {
        exec(inscribeCmd, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error with file ${imageFile}: ${error.message}`);
            }
            if (stderr) {
                return reject(`Stderr with file ${imageFile}: ${stderr}`);
            }
            
            // Save output to JSON file
            fs.writeFile(jsonOutputFile, stdout, (err) => {
                if (err) {
                    reject(`Failed to write to file ${jsonOutputFile}: ${err}`);
                } else {
                    resolve(`Output for ${imageFile} saved to ${jsonOutputFile}`);
                }
            });
        });
    });
}

// Main function to run the operations
async function main() {
    try {
        const utxos = await getUTXOs();
        for (let i = 0; i < Math.min(utxos.length, 10); i++) {
            console.log(i)
            const imageFile = `${i}.png`;
            let j
            if (i>2){
                j = i+1
            } else {
                j=i
            }
            await inscribeImage(imageFile, utxos[j]);

            console.log(`Inscribed ${imageFile} with UTXO ${utxos[j]}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

// Execute the main function
main();
