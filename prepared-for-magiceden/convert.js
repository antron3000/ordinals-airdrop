const fs = require('fs');

// Read the JSON file containing the array of objects
const jsonData = fs.readFileSync('all_extracted_data2.json', 'utf8');

// Parse the JSON data
const originalArray = JSON.parse(jsonData);

// Counter for batch numbers
let batchNumber = 1;

// Perform the conversion
const convertedArray = originalArray.map(obj => {
  const convertedObj = {
    id: obj.id,
    meta: {
      name: "ExO Recruits #" + batchNumber,
      attributes: [
        {
          trait_type: "Recruit name",
          value: obj.metadata.name
        },
        {
          trait_type: "batch",
          value: obj.metadata.batch.toString()
        }
      ]
    }
  };
  
  // Increment batch number for the next object
  batchNumber++;

  return convertedObj;
});

// Convert the array back to JSON format
const convertedJson = JSON.stringify(convertedArray, null, 2);

// Write the converted JSON data to a new file
fs.writeFileSync('converted_file.json', convertedJson);

console.log('Conversion completed successfully.');
