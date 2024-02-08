function transportaParaPlanilha({ Insights, sheetName, sheetID }) {
    const Sheet = SpreadsheetApp.openById(sheetID);
    let plan = Sheet.getSheetByName(sheetName);
    if (null === plan) {
        plan = Sheet.insertSheet(sheetName);
    }
    const range = plan.getRange(1, 1, Insights.length, Insights[0].length);
    range.setValues(Insights);
}
