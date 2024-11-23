const fs = require("fs");
const companiesCSV = fs.readFileSync("./mock/TEST_DATA1.csv", "utf-8");

function csvToJson(companiesCSV) {
  const rows = companiesCSV.split("\n").filter((row) => row.trim() !== ""); // Split by line and remove empty rows - perhaps the end of the file
  const headers = rows[0].split(",").map((header) => header.trim()); // First row is the headers(Json keys)

  const jsonArray = rows.slice(1).map((row) => {
    const values = row
      .split(",")
      .map((value) => value.trim().replace(/^"|"$/g, "")); // Split row by commas and replace "" where not Job title with empty string
    const companiesObject = {};

    headers.forEach((header, index) => {
      companiesObject[header] = values[index] || ""; // Map each header to its corresponding value (Key,value) pair
    });

    return companiesObject;
  });

  return jsonArray;
}

function writeJsonToFile(data, filename) {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filename, jsonString);
  console.log(`JSON written to ${filename}`);
}

// Convert CSV to JSON
const companiesJson = csvToJson(companiesCSV);

// Write the JSON to a file
writeJsonToFile(companiesJson, "companiesJsonOutput.json");
