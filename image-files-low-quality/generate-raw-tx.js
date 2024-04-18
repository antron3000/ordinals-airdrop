const { execSync } = require('child_process');

// Function to fetch UTXOs from the ordinals tool
function fetchUTXOs() {
    const utxosCommand = `ord --testnet --index ~/.local/share/ord/testnet3/index.redb --cookie-file ~/.bitcoin/testnet3/.cookie --ignore-descriptors wallet cardinals`;
    try {
        const output = execSync(utxosCommand);
        const utxos = JSON.parse(output.toString());
        return utxos.map(utxo => `${utxo.output}`);
    } catch (error) {
        console.error('Failed to fetch UTXOs:', error);
        return [];
    }
}

// Directory and other constant settings
const imageDirectory = '~/inscriptions/exoHeroes/ordinals-airdrop/image-files-low-quality';
console.log(imageDirectory)
const ordCommandBase = `ord --testnet --index ~/.local/share/ord/testnet3/index.redb --cookie-file ~/.bitcoin/testnet3/.cookie --ignore-descriptors wallet inscribe --fee-rate 100 --coin-control --no-broadcast`;

// Fetch UTXOs
const utxos = fetchUTXOs();

if (utxos.length < 1) {
    console.error('Not enough UTXOs available to inscribe all images. Required: 10, Available:', utxos.length);
} else {
    for (let i = 0; i < 1; i++) {
        const imageFile = `${i}.png`;
        const utxo = utxos[i];
        const outputFile = `${i}.json`;
        const command = `${ordCommandBase} --file ${imageDirectory}/${imageFile} --utxo ${utxo} >> ${imageDirectory}/${outputFile}`;
        
        try {
            console.log(`Inscribing image ${imageFile} using UTXO ${utxo}`);
            const output = execSync(command);
            console.log(`Output for ${imageFile}:`, output.toString());
        } catch (error) {
            console.error(`Error inscribing image ${imageFile}:`, error);
        }
    }
}
