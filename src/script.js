const fs = require("fs");
const companiesCSV = fs.readFileSync("./mock/TEST_DATA.csv", "utf-8");
//const coverLetterTemplate = require("../assets/cover-letter-template-01.txt");
const TestUserFirstName = "FirstName";
const TestUserLastName = "LastName";

function csvToJson(companiesCSV) {
  const rows = companiesCSV.split("\n").filter((row) => row.trim() !== ""); // Split by line and remove empty rows - perhaps the end of the file
  const headers = rows[0].split(",").map((header) => header.trim()); // First row is the headers(Json keys)

  const CompaniesDetailsJSONArray = rows.slice(1).map((row) => {
    const values = row
      .split(",")
      .map((value) => value.trim().replace(/^"|"$/g, "")); // Split row by commas and replace "" where Job title not provided with empty string
    const companiesObject = {};

    headers.forEach((header, index) => {
      companiesObject[header] = values[index] || ""; // Map each header to its corresponding value (Key,value) pair
    });

    return companiesObject;
  });
  console.log(`JSON file for input CSV file ${companiesCSV.filename} created`);
  return CompaniesDetailsJSONArray;
}

function writeJsonToFile(data, filename) {
  const outputFolder = "output";
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    console.log(`Created folder: ${outputFolder}`);
  }
  const filePath = `${outputFolder}/${filename}`;

  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonString);

  console.log(`JSON written to ${filename}`);
}

// Convert CSV to JSON
const companiesJson = csvToJson(companiesCSV);

// Write the JSON to a file -- first step
writeJsonToFile(companiesJson, "companiesJsonOutput.json");
