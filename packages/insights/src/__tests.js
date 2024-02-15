/**
 * ██╗   ██╗████████╗██╗██╗     ███████╗
 * ██║   ██║╚══██╔══╝██║██║     ██╔════╝
 * ██║   ██║   ██║   ██║██║     ███████╗
 * ██║   ██║   ██║   ██║██║     ╚════██║
 * ╚██████╔╝   ██║   ██║███████╗███████║
 *  ╚═════╝    ╚═╝   ╚═╝╚══════╝╚══════╝
 */
function testCreateRequest() {
    test("createRequest", () => {
        const request = createRequest({
            url: "https://banana.com",
            method: "get",
            params: {
                metric: "page_impressions",
                since: "2021-01-01",
                until: "2021-01-31",
                period: "day",
            },
        });
        console.log({ request, payload: request[1] });

        if (request[0] !== "https://banana.com") {
            throw new Error("URL incorreta");
        }

        if (typeof request[1] === "object") {
            const params = {
                method: "get",
                payload: {
                    metric: "page_impressions",
                    since: "2021-01-01",
                    until: "2021-01-31",
                    period: "day",
                },
            };

            if (JSON.stringify(request[1]) !== JSON.stringify(params)) {
                throw new Error("Parâmetros incorretos");
            }
        }
    });
}

function testSheetToTuples() {
    test("sheetToTuples", () => {
        const sheetName = "[releases]";
        const tuple = sheetToTuples(CONFIG.ids.sheet(), sheetName);
        console.log(tuple);
    });
}

/**
 * ████████╗██████╗ ███████╗██╗     ██╗      ██████╗
 * ╚══██╔══╝██╔══██╗██╔════╝██║     ██║     ██╔═══██╗
 *    ██║   ██████╔╝█████╗  ██║     ██║     ██║   ██║
 *    ██║   ██╔══██╗██╔══╝  ██║     ██║     ██║   ██║
 *    ██║   ██║  ██║███████╗███████╗███████╗╚██████╔╝
 *    ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝
 */
function testTrelloInsights() {
    test("trelloInsights", () => {
        const sheetName = "[trello] Cards";
        const sheetID = CONFIG.ids.sheet();
        const referenceSheet = "[releases]";

        trelloInsights({ sheetName, sheetID, referenceSheet });
    });
}

function testGetCard() {
    test("getCard", () => {
        const card = getCard("63bc6821a75b99022f42b6e2", [
            "badges",
            "dateLastActivity",
            "due",
            "idChecklists",
            "labels",
            "name",
            "shortUrl",
        ]);
        console.log({ card, labels: card.labels });
    });
}

function testGetLabel() {
    test("getLabel", () => {
        const label = getLabel("6010dc77bb436e116f396ba1");
        console.log({ label });
    });
}
