const fs = require('fs');

// Function to read a JSON file
function readJsonFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Function to combine, deduplicate, and sort data
async function combineSortDeduplicate(file1, file2, outputFile) {
    try {
        const data1 = await readJsonFile(file1);
        const data2 = await readJsonFile(file2);

        const combinedData = [...data1, ...data2];
        const uniqueIds = new Set();
        const uniqueData = [];

        // Deduplicate entries based on ID
        combinedData.forEach(item => {
            if (!uniqueIds.has(item.id)) {
                uniqueData.push(item);
                uniqueIds.add(item.id);
            }
        });

        // Sort entries based on batch number and numeric part of ID
        uniqueData.sort((a, b) => {
            const batchA = parseInt(a.metadata.batch, 10);
            const batchB = parseInt(b.metadata.batch, 10);
            if (batchA !== batchB) {
                return batchA - batchB;
            }

            // Extracting numeric part of the ID
            const numericIdA = parseInt(a.id.match(/\d+$/)[0], 10);
            const numericIdB = parseInt(b.id.match(/\d+$/)[0], 10);
            return numericIdA - numericIdB;
        });

        // Write the sorted data to a new file
        fs.writeFile(outputFile, JSON.stringify(uniqueData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('Combined file has been saved successfully.');
        });
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

// Example usage
combineSortDeduplicate('all_extracted_data1.json', 'all_extracted_data.json', 'combined_data.json');
