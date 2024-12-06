document.addEventListener("DOMContentLoaded", () => {
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const companyFileInput = document.getElementById("companyFile");
  const generateButton = document.getElementById("generateButton");

  generateButton.addEventListener("click", () => {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    const companyFile = companyFileInput.files[0]; // The first uploaded file (if any)
    const fileName = companyFile ? companyFile.name : "No file uploaded";
    const fileType = companyFile ? companyFile.type : "N/A";

    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
    console.log(`File Name: ${fileName}`);
    console.log(`File Type: ${fileType}`);
  });
});

console.log("script loaded . . .");
