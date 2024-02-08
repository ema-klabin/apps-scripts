/**
 * Retorna os insights do instagram de acordo com as configurações passadas
 */
function getInstaInsights(requests, token) {
    const Insights = formatRequests(requests, CONFIG.ids.insta(), token);

    const response = loopFetch(Insights);

    return response;
}

/**
 * Retorna os insights do facebook de acordo com as configurações passadas
 */
function getInsights(requests, token) {
    const Insights = formatRequests(requests, CONFIG.ids.fbPage(), token);

    const response = loopFetch(Insights);

    return response;
}

function loopFetch(Loop) {
    const response = Loop.map((item) => {
        return Utilities.jsonParse(
            UrlFetchApp.fetch(item, {
                method: "GET",
            }).getContentText()
        );
    });
    return response;
}

function formatRequests(requests, objectID, token) {
    const Requests = requests.map((request) => {
        let URL = `${GRAPHAPI.URL}/${objectID}/insights?access_token=${token}`;

        const params = {
            metric: request.metric,
            since: request.since,
            until: request.until,
            period: request.period,
        };

        let urlParams = [];

        Object.keys(params).map((key) => {
            if ("undefined" !== typeof params[key]) {
                urlParams.push(`${key}=${params[key]}`);
            }
        });

        URL += `&${urlParams.join("&")}`;

        return URL;
    });

    return Requests;
}
