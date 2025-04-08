// --- Configuration ---
// Spreadsheet ID for your specific sheet
var SPREADSHEET_ID = '1FhLVXR66IkhoM9vbh736EHcWkFsej8EHRD5TQZQ2sog';
// You can change the sheet name if needed (make sure it matches your sheet)
var SHEET_NAME = 'Sheet1';
// Define header row - ADD NEW HEADERS HERE
var HEADER_ROW = ['Timestamp', "Farmer's Name", 'RTO Number', 'Chassis Number', 'Aadhar Number', 'Machine Type', 'Aadhar Front Link', 'Aadhar Back Link'];
// --- End Configuration ---

// Serves the HTML page using the templating service
function doGet(e) {
  // Use createTemplateFromFile and evaluate() to process scriptlets <?!= ... ?>
  return HtmlService.createTemplateFromFile('index')
      .evaluate() // Evaluate the template to execute scriptlets
      .setTitle('Agri Machinery Tracker')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Allows embedding if needed later
}

// Processes the form submission
function processForm(formObject) {
  try {
    // Basic server-side check for required fields (match the HTML)
    // Note: HTML5 'required' does most of the work, this is a fallback.
    var requiredFields = ['farmerName', 'rtoNumber', 'chassisNumber', 'aadharNumber', 'machineType', 'aadharFrontLink', 'aadharBackLink'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        if (!formObject[field]) {
            throw new Error('Missing required field: ' + field);
        }
    }
     // Optional: Add more specific validation like Aadhar format check again here if needed

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Check if sheet exists, create if not
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add header row if the sheet is newly created
      sheet.appendRow(HEADER_ROW);
    } else if (sheet.getLastRow() === 0) {
      // Ensure header row exists if sheet was empty
       sheet.appendRow(HEADER_ROW);
     }

    // Get data from form object
    var timestamp = new Date();
    var farmerName = formObject.farmerName;
    var rtoNumber = formObject.rtoNumber;
    var chassisNumber = formObject.chassisNumber;
    var aadharNumber = formObject.aadharNumber; // New field
    var machineType = formObject.machineType;
    var aadharFrontLink = formObject.aadharFrontLink; // New field
    var aadharBackLink = formObject.aadharBackLink;   // New field


    // Append data to the sheet in the correct order
    sheet.appendRow([
        timestamp,
        farmerName,
        rtoNumber,
        chassisNumber,
        aadharNumber, // Added
        machineType,
        aadharFrontLink, // Added
        aadharBackLink   // Added
        ]);

    return 'Data submitted successfully!';

  } catch (error) {
    Logger.log('Error in processForm: ' + error);
    // Throw the error so the client-side onFailure handler catches it
    throw new Error('Failed to submit data. Error: ' + error.message);
  }
}
