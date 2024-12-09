const fs = require("fs");
const PDFDocument = require("pdfkit");
//const zlib = require("zlib");

//Dev data
const companiesCSV = fs.readFileSync("./mock/TEST_DATA.csv", "utf-8"); //Address for the company detail file - temporary
const TestUserFirstName = "Shirin";
const TestUserLastName = "Mohajer";
const coverLetterTempFilePath = "../client/assets/cover-letter-template-01.txt";

function csvToJson(companiesCSV) {
  const rows = companiesCSV.split("\n").filter((row) => row.trim() !== "");
  const headers = rows[0].split(",").map((header) => header.trim());

  const parseRow = (row) => {
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"' && row[i + 1] !== '"') {
        // Toggle insideQuotes for unescaped quotes
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        // If comma is encountered and not inside quotes, add current value
        values.push(current.trim());
        current = "";
      } else {
        // Add character to current value
        current += char;
      }
    }
    values.push(current.trim());
    return values.map((value) => value.replace(/^"|"$/g, "").trim());
  };

  const CompaniesArrayOfJSON = rows.slice(1).map((row) => {
    const values = parseRow(row);
    const companiesObject = {};

    headers.forEach((header, index) => {
      companiesObject[header] = values[index] || "";
    });

    return companiesObject;
  });

  console.log(`JSON created from CSV:`, CompaniesArrayOfJSON);
  return CompaniesArrayOfJSON; // Return array of company objects
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
      .replace(/\[Address\]/g, company.address || "")
      .replace(
        /\[City, State Zip\]/g,
        `${company.city}, ${company.state} ${company.zip}` || ""
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
    /**
     * PDFDocument instances are **readable** Node streams.
     * They don't get saved anywhere automatically,
     * but you can call the pipe method to send the output of the PDF document to another writable Node stream as it is being written.
     * When you're done with your document, call the end method to finalize it.
     */
    pdfDoc.pipe(writeStream);
    pdfDoc
      .font("Times-Roman")
      .fontSize(12)
      .text(personalizedLetter, { align: "left" });
    /**
     * PDFDocument instances are readable Node streams.
     * They don't get saved anywhere automatically,
     * but you can call the pipe method to send the output of the PDF document to another writable Node stream as it is being written.
     * When you're done with your document, call the end method to finalize it.
     */
    pdfDoc.end();

    console.log(`PDF created: ${pdfPath}`);
  });
}

// Convert CSV to JSON -- convert step
const CompaniesArrayOfJSON = csvToJson(companiesCSV);
// Write the JSON to a file -- first step
writeJsonToFile(CompaniesArrayOfJSON, "companiesJsonOutput.json");
//Create PDF off of JSON file Using PDFKit - create step
const coverLettersPDFList = createCoverLettersPDF(CompaniesArrayOfJSON);
console.log(coverLettersPDFList);
//compressToZipFile(coverLettersPDFList);
