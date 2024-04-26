const fs = require('fs');

const walletFile = './wallets.json'; // Path to the wallet JSON file

// List of delegates with corresponding names and their rarity values
const delegates = [
  { delegate: '565ef9f67e6899011ad37f7c75410c564d77e2052a366010c065a0bcb9bb1a0ci0', name: 'The Simplifier', rarity: 3100 },
  { delegate: '8e6432cf772fbc509a6a278262e465f0a5acf674ed3f2606abddeb45c3414af3i0', name: 'Captain Engage-o-Matic', rarity: 2250 },
  { delegate: 'fe4d8fa19b7c30a75db3e439e72c2f0abea2b02beef0a06ed73db03327b6c4c5i0', name: 'Dash', rarity: 1350 },
  { delegate: 'f1cd1870a3c123cf197ac1ac3f38711ede851579136f1e01622eec0b18e60e33i0', name: 'AI-X', rarity: 1900 },
  { delegate: 'ff7a3b1dbe8747e96de412d84f9ec07e79f41b846ec871dd0509b08fe8600caci0', name: 'The Crowd Whisperer', rarity: 2925 },
  { delegate: '68dddf6c9fbede5b4f6e014149946517685c4aea79250051575cb68136e8d3d9i0', name: 'The Mad Scientist', rarity: 1040 },
  { delegate: '5b098af38a23fb62cc3582089a47cf8b0132240a5f19cfdfc92ba7e1cfc61064i0', name: 'The Neo Nomad', rarity: 1660 },
  { delegate: 'a54ac0c0eded95a4eb3de63e4de5b2f9381ef6e80e4a9b1dfc9d95f10df93491i0', name: 'The Nimble Networker', rarity: 2700 },
  { delegate: '6f61140106d80cf14a25a43a66a51c7f9a2d3475449c374db6b1cc554a08a767i0', name: 'The Renaissance Sam', rarity: 2200 },
  { delegate: '30e5f9c5084970e3c2bdf8cec3c61574b1b2ff30fcbda4a8c1750a8f4c8c09d9i0', name: 'The Resource Renegade', rarity: 2875 }
];

// Function to select a delegate based on rarity
function selectDelegateByRarity() {
  const totalRarity = delegates.reduce((acc, delegate) => acc + delegate.rarity, 0);
  let randomPoint = Math.random() * totalRarity;
  for (const delegate of delegates) {
    if (randomPoint < delegate.rarity) {
      return delegate;
    }
    randomPoint -= delegate.rarity;
  }
}

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
  const batchNumber = 9; // Define the batch number here

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
      'parent: 9d71fc47daede70dde1dd4af7cdfffac18627f797d7542880ec6db2107ad62b6i0',
      '',
      '# postage for each inscription:',
      'postage: 546',
      '',
      'inscriptions:',
      ''
    ];

    wallets.forEach(wallet => {
      const selectedDelegate = selectDelegateByRarity();
      lines.push('- file: a.txt');
      lines.push(`  delegate: ${selectedDelegate.delegate}`);
      lines.push(`  destination: ${wallet}`);
      lines.push('  metadata:');
      lines.push(`    name: ${selectedDelegate.name}`);
      lines.push(`    batch: ${batchNumber}`);  // Batch number included in metadata
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
