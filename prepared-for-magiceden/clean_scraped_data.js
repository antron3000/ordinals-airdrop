const fs = require('fs');

// Function to remove duplicates
function removeDuplicates(data) {
    const result = [];
    const paths = new Set();  // To keep track of paths without the query parameter

    data.forEach(item => {
        const path = item.split('?')[0];  // Get the path without query parameters
        if (!paths.has(path)) {
            result.push(item);  // Add to result if not already added
            paths.add(path);  // Mark this path as seen
        }
    });

    return result;
}

// Read the JSON file
fs.readFile('scraped_data.json', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        const filteredData = removeDuplicates(jsonData);

        // Save the filtered data back to the file
        fs.writeFile('scraped_data.json', JSON.stringify(filteredData, null, 2), err => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('File has been saved with the duplicates removed.');
            }
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});
