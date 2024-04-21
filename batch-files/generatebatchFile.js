const fs = require('fs');

const walletFile = './wallets.json'; // Path to the wallet JSON file

// Read wallet addresses from the JSON file
function readWallets() {
  return new Promise((resolve, reject) => {
    fs.readFile(walletFile, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const wallets = JSON.parse(data);
        resolve(wallets);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

// Generate the batch file
async function generateBatchFile() {
  try {
    const wallets = await readWallets();
    const lines = [
      '# example batch file',
      '',
      '# inscription modes:',
      '# - `same-sat`: inscribe on the same sat',
      '# - `satpoints`: inscribe on the first sat of specified satpoint\'s output',
      '# - `separate-outputs`: inscribe on separate postage-sized outputs',
      '# - `shared-output`: inscribe on a single output separated by postage',
      'mode: separate-outputs',
      '',
      'parent: 2d26d389f5c6500780b64af7f41a4560c619fb5d5870e7f3df927fad80b93ef6i0',
      '',
      '# postage for each inscription:',
      'postage: 333',
      '',
      'inscriptions:',
      ''
    ];

    wallets.forEach(wallet => {
      lines.push('- file: a.txt');
      lines.push('  delegate: 37dee2b7ad0caef9f640e4399a4ed9e507ab5df4c0ced6d441fb66c97f242e9di0');
      lines.push(`  destination: ${wallet}`);
      lines.push('  metadata:');
      lines.push('    name: Captain Engage-o-matic');
      lines.push('');
    });

    const batchFilePath = './batch.yaml';
    fs.writeFile(batchFilePath, lines.join('\n'), (err) => {
      if (err) {
        console.error('Failed to write batch file:', err);
      } else {
        console.log('Batch file created successfully:', batchFilePath);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

generateBatchFile();
