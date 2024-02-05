function transportaParaPlanilha({ Insights, sheetName, sheetID }) {
    const Sheet = SpreadsheetApp.openById(sheetID);
    let plan = Sheet.getSheetByName(sheetName);
    if (null === plan) {
        plan = Sheet.insertSheet(sheetName);
    }
    const range = plan.getRange(1, 1, Insights.length, Insights[0].length);
    range.setValues(Insights);
}

function analyticsDimensions(...dimensions) {
    return dimensions.map((d) => {
        const dimension = AnalyticsData.newDimension();
        dimension.name = d;
        return dimension;
    });
}

function analyticsMetrics(...metrics) {
    return metrics.map((m) => {
        const metric = AnalyticsData.newMetric();
        metric.name = m;
        return metric;
    });
}

function analyticsDateRange(startDate, endDate) {
    const dateRange = AnalyticsData.newDateRange();
    dateRange.startDate = startDate;
    dateRange.endDate = endDate;
    return dateRange;
}

function analyticsOrderBy(dimension, desc = false) {
    const orderBy = AnalyticsData.newOrderBy();
    orderBy.desc = desc;
    const dimensionOrderBy = AnalyticsData.newDimensionOrderBy();
    dimensionOrderBy.dimensionName = dimension.name;
    dimensionOrderBy.orderType = "NUMERIC";
    orderBy.dimension = dimensionOrderBy;
    return orderBy;
}

function analyticsRequest({ dimensions, metrics, dateRange, orderBy }) {
    const request = AnalyticsData.newRunReportRequest();
    request.dimensions = dimensions;
    request.metrics = metrics;
    request.dateRanges = [dateRange];
    request.orderBys = [orderBy];
    return request;
}
