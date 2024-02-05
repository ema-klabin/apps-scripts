function instaInsights({ metrics, startDate, endDate, sheetName, sheetID }) {
    const datas = loopDate(startDate, endDate, 28);

    const Requests = datas.map((data) => {
        return {
            method: "GET",
            objectID: CONFIG.ids.insta(),
            metric: metrics.join(","),
            since: data.since,
            until: data.until,
            period: "day",
        };
    });

    const insights = getInstaInsights(Requests, CONFIG.tokens.graphAPI());

    const Insights = [];

    insights.map((linha, i) => {
        if (i === 0) {
            const cabecalho = linhaCabecalho(0, metrics.length, linha);
            Insights.push(["data", ...cabecalho]);

            const descricao = linhaDescricao(0, metrics.length, linha);
            Insights.push(["yyyy-MM-dd", ...descricao]);

            const somas = [
                "_totais_",
                "=SUM(B4:B)",
                "=SUM(C4:C)",
                "=SUM(D4:D)",
                "=SUM(E4:E)",
                "=SUM(F4:F)",
                "=SUM(G4:G)",
                "=SUM(H4:H)",
            ];
            Insights.push(somas);

            linha.data[0].values.forEach((value, j) => {
                const rowValues = linhaValores(
                    value,
                    1,
                    metrics.length,
                    linha,
                    j
                );
                Insights.push(rowValues);
            });
        } else {
            linha.data[0].values.forEach((value, j) => {
                const rowValues = linhaValores(
                    value,
                    1,
                    metrics.length,
                    linha,
                    j
                );
                Insights.push(rowValues);
            });
        }
    });

    transportaParaPlanilha({ Insights, sheetName, sheetID });
}

function pageInsights({ metrics, startDate, endDate, sheetName, sheetID }) {
    const datas = loopDate(startDate, endDate, 28);

    const Requests = datas.map((data) => {
        return {
            method: "GET",
            objectID: CONFIG.ids.fbPage(),
            metric: metrics.join(","),
            since: data.since,
            until: data.until,
            period: "day",
        };
    });

    const insights = getInsights(Requests, CONFIG.tokens.graphAPI());

    const Insights = [];

    insights.map((linha, i) => {
        if (i === 0) {
            const cabecalho = linhaCabecalho(0, metrics.length, linha);
            Insights.push(["data", ...cabecalho]);

            const descricao = linhaDescricao(0, metrics.length, linha);
            Insights.push(["yyyy-MM-dd", ...descricao]);

            const somas = [
                "_totais_",
                "=SUM(B4:B)",
                "=SUM(C4:C)",
                "=SUM(D4:D)",
                "=SUM(E4:E)",
                "=SUM(F4:F)",
                "=SUM(G4:G)",
                "=SUM(H4:H)",
            ];
            Insights.push(somas);

            linha.data[0].values.forEach((value, j) => {
                const rowValues = linhaValores(
                    value,
                    1,
                    metrics.length,
                    linha,
                    j
                );
                Insights.push(rowValues);
            });
        } else {
            linha.data[0].values.forEach((value, j) => {
                const rowValues = linhaValores(
                    value,
                    1,
                    metrics.length,
                    linha,
                    j
                );
                Insights.push(rowValues);
            });
        }
    });

    transportaParaPlanilha({ Insights, sheetName, sheetID });
}

function linhaValores(value, start, length, linha, index) {
    const rowValues = [];
    rowValues.push(
        Utilities.formatDate(
            new Date(value.end_time),
            "GMT-03:00",
            "yyyy-MM-dd"
        )
    );
    rowValues.push(value.value);
    for (let i = start; i < length; i++) {
        rowValues.push(linha.data[i].values[index].value);
    }
    return rowValues;
}

function linhaCabecalho(start, length, linha) {
    const rowValues = [];
    for (let i = start; i < length; i++) {
        rowValues.push(linha.data[i].name);
    }
    return rowValues;
}

function linhaDescricao(start, length, linha) {
    const rowValues = [];
    for (let i = start; i < length; i++) {
        rowValues.push(linha.data[i].description);
    }
    return rowValues;
}

function loopDate(i = "2021-01-01", f = "2021-12-31", intervalo = 30) {
    const inicio = new Date(i);
    const fim = new Date(f);
    let datas = [];
    let data = inicio;
    while (data <= fim) {
        const dataInicio = new Date(data);
        const newDate = new Date(data.setDate(data.getDate() + intervalo));

        datas.push({
            since: Utilities.formatDate(dataInicio, "GMT", "yyyy-MM-dd"),
            until: Utilities.formatDate(newDate, "GMT", "yyyy-MM-dd"),
        });

        data = new Date(newDate);
    }
    return datas;
}
