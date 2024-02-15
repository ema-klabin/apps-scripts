function trelloInsights({ sheetName, sheetID, referenceSheet }) {
    const releases = sheetToTuples(sheetID, referenceSheet);
    const cardsIds = releases.find((release) => {
        return release[0] === "trelloCardID";
    })[1];

    const cards = cardsIds
        .map((cardId) => {
            return getCard(cardId);
        })
        .filter((card) => {
            return card !== null;
        });

    const Insights = [];

    // header
    Insights.push([
        "id",
        "desc",
        "name",
        "shortUrl",
        "labels",
        "due",
        "lastActivity",
        "checklists",
    ]);

    cards.map((card) => {
        if (card) {
            const checklists = card.idChecklists.map((checklistId) => {
                const checklist = getChecklist(checklistId);
                const counter = countCompleteCheckItems(checklist);
                return `${checklist.name}: ${counter[0]}/${counter[1]}`;
            });

            Insights.push([
                card.id,
                card.desc,
                card.name,
                card.shortUrl,
                card.labels
                    .map((label) => {
                        return label.name;
                    })
                    .join(", "),
                card.due,
                card.dateLastActivity,
                checklists.join(", "),
            ]);
        }
    });

    transportaParaPlanilha({ Insights, sheetName, sheetID });
}

function getCard(cardId, fields) {
    if (cardId) {
        const api = createRequest({
            base: `https://api.trello.com/1/cards/${cardId}`,
            method: "get",
            params: {
                key: CONFIG.keys.trello(),
                token: CONFIG.tokens.trello(),
                fields:
                    typeof fields !== "undefined" ? fields.join(",") : "all",
            },
        });

        return Utilities.jsonParse(
            UrlFetchApp.fetch(api[2], {
                muteHttpExceptions: true,
            }).getContentText()
        );
    }
}

function getLabel(labelId) {
    const api = createRequest({
        base: `https://api.trello.com/1/labels/${labelId}`,
        method: "get",
        params: {
            key: CONFIG.keys.trello(),
            token: CONFIG.tokens.trello(),
        },
    });

    return Utilities.jsonParse(UrlFetchApp.fetch(api[2]).getContentText());
}

function getChecklist(checklistId) {
    const api = createRequest({
        base: `https://api.trello.com/1/checklists/${checklistId}`,
        method: "get",
        params: {
            key: CONFIG.keys.trello(),
            token: CONFIG.tokens.trello(),
        },
    });

    return Utilities.jsonParse(UrlFetchApp.fetch(api[2]).getContentText());
}

function countCompleteCheckItems(checklist) {
    let complete = 0;

    checklist.checkItems.map((item) => {
        if (item.state === "complete") {
            complete++;
        }
    });

    return [complete, checklist.checkItems.length];
}
