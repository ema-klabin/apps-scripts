function loopFetch(Loop) {
    const response = Loop.map((item) => {
        return Utilities.jsonParse(UrlFetchApp.fetch(item).getContentText());
    });
    return response;
}

function createRequest({ base, method, params }) {
    const options = {
        method: method.toLowerCase(),
        contentType: "application/json",
        payload: JSON.stringify(params),
    };

    const query = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");

    return [base, options, base + `?${query}`];
}

function sheetToTuples(sheetId, sheetName) {
    // Get the sheet object
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);

    // Get the range of data (excluding header row)
    const dataRange = sheet.getDataRange();
    const dataValues = dataRange.getValues();

    // Extract headers (first row)
    const headers = dataValues[0];

    // Extract data (all rows after the first)
    const data = dataValues.slice(1);

    return headers.map((header, i) => {
        return [header, data.map((row) => row[i])];
    });
}

function test(title, callback) {
    try {
        callback();
        console.log(`✅ ${title}`);
    } catch (error) {
        console.error(`❌ ${title}`);
        console.error(error);
    }
}
