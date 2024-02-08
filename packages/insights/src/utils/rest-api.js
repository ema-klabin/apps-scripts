class RestAPI {
    constructor({ base, headers, tokens }) {
        this.base = base;
        this.headers = headers;
        this.tokens = tokens;
    }

    get({ base = null, namespace, endpoint, headers = null, params = null }) {
        const baseUrl = base || this.base;

        let paramsUrl = [];
        if (params) {
            Object.entries(params).map(([key, value]) => {
                paramsUrl.push([key, value]);
            });
        }
        if (paramsUrl.length >= 1) {
            paramsUrl =
                "?" +
                paramsUrl
                    .map((params) => {
                        return `${params[0]}=${params[1]}`;
                    })
                    .join("&");
        }

        let url = `${baseUrl}/`;
        if (namespace) {
            url = url + `${namespace}/`;
        }
        if (endpoint) {
            url = url + `${endpoint}`;
        }
        if (params) {
            url = url + `${paramsUrl}`;
        }

        const options = {
            method: "GET",
            headers: headers || this.headers,
        };

        return Utilities.jsonParse(UrlFetchApp.fetch(url, options));
    }
}
