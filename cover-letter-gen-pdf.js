const fs = require("fs");
const PDFDocument = require("pdfkit");

const companiesCSV = fs.readFileSync("./mock/TEST_DATA.csv", "utf-8");
const TestUserFirstName = "Shirin";
const TestUserLastName = "Mohajer";
const coverLetterTempFilePath =
  "../../client/public/assets/cover-letter-template-01.txt";

function csvToJson(companiesCSV) {
  const rows = companiesCSV.split("\n").filter((row) => row.trim() !== ""); // Split by line and remove empty rows - perhaps the end of the file
  const headers = rows[0].split(",").map((header) => header.trim()); // First row is the headers(Json keys)

  const CompaniesArrayOfJSON = rows.slice(1).map((row) => {
    const values = row
      .split(",")
      .map((value) => value.trim().replace(/^"|"$/g, "")); // Remove quotes from values // Split row by commas and replace "" where Job title not provided with empty string
    const companiesObject = {};

    headers.forEach((header, index) => {
      companiesObject[header] = values[index] || ""; // Map each header to its corresponding value (Key,value) pair
    });

    return companiesObject;
  });
  console.log(`JSON file for input CSV file ${companiesCSV.filename} created`);
  return CompaniesArrayOfJSON; //Array of companies' object
}

//Write to file
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

//Create PDF
function createCoverLettersPDF(companiesInJson) {
  const COVER_LETTER_CONTENT = fs.readFileSync(
    coverLetterTempFilePath,
    "utf-8"
  );
  console.log(COVER_LETTER_CONTENT);

  // const companiesJson = JSON.parse(
  //   fs.readFileSync("./output/companiesJsonOutput.json", "utf-8")
  // );

  const outputFolder = "output/pdfs";

  // Ensure the output folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
    console.log(`Created folder: ${outputFolder}`);
  }

  companiesInJson.forEach((company, index) => {
    const personalizedLetter = COVER_LETTER_CONTENT.replace(
      /\[Company Name\]/g,
      company.company || "Dear Hiring Manager"
    )
      .replace(/\[Address\]/g, company.address || "Unknown Address")
      .replace(
        /\[City, State Zip\]/g,
        `${company.city}, ${company.state} ${company.zip}` || "Unknown Location"
      )
      .replace(
        /\[Name\]/g,
        `${company.first_name} ${company.last_name}` || "Hiring Manager"
      )
      .replace(
        /\[Your Name\]/g,
        `${TestUserFirstName} ${TestUserLastName}` || "Your Name Here"
      ); // Replace with your name

    // Create a PDF for the personalized letter
    const pdfDoc = new PDFDocument();
    const pdfPath = `${outputFolder}/${company.company}-cover-letter-${
      index + 1
    }.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);

    pdfDoc.pipe(writeStream);
    pdfDoc
      .font("Times-Roman")
      .fontSize(12)
      .text(personalizedLetter, { align: "left" });

    pdfDoc.end();

    console.log(`PDF created: ${pdfPath}`);
  });
}

// Convert CSV to JSON
const CompaniesArrayOfJSON = csvToJson(companiesCSV);
// Write the JSON to a file -- first step
writeJsonToFile(CompaniesArrayOfJSON, "companiesJsonOutput.json");
//Create PDF off of JSON file Using PDFKit
createCoverLettersPDF(CompaniesArrayOfJSON);
