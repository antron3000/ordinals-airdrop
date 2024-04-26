const fs = require('fs');

// Read the JSON file
fs.readFile('all_extracted_data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    // Check if jsonData is an array and reverse it
    if (Array.isArray(jsonData)) {
        jsonData.reverse();
    } else {
        console.error('The JSON data is not an array and cannot be reversed.');
        return;
    }

    // Convert the reversed array back to a JSON string
    const reversedData = JSON.stringify(jsonData, null, 2);

    // Write the reversed JSON to a new file
    fs.writeFile('reversed_all_extracted_data.json', reversedData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing the file:', err);
        } else {
            console.log('Reversed JSON has been saved to reversed_all_extracted_data.json');
        }
    });
});
