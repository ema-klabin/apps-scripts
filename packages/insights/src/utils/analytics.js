function analyticsAudienceReport() {
    const metricsDescription = [
        [
            "totalUsers",
            "O número de usuários distintos que registraram pelo menos um evento, independentemente do site ou app estar em uso quando esse evento foi registrado.",
        ],
        [
            "activeUsers",
            "Número de usuários únicos que acessaram seu site ou app.",
        ],
        [
            "newUsers",
            "O número de usuários que interagiram com seu site ou acessaram seu app pela primeira vez (evento acionado: first_open ou first_visit).",
        ],
        [
            "sessions",
            "O número de sessões iniciadas no seu site ou app (evento acionado: session_start).",
        ],
        [
            "sessionsPerUser",
            "Número médio de sessões por usuário (sessões divididas por usuários ativos).",
        ],
    ];

    const percentValues = [];

    analytics({
        dim: "date",
        met: metricsDescription,
        percentValues,
        startDate,
        endDate,
        sheetName: "[site-ga4] Audiência",
        sheetID: CONFIG.ids.sheet(),
    });
}

function analyticsEngagementReport() {
    const metricsDescription = [
        [
            "bounceRate",
            "A porcentagem de sessões não engajadas ((menos sessões engajadas) dividida por sessões. Essa métrica é retornada como uma fração. Por exemplo, 0,2761 significa que 27,61% das sessões foram rejeições.",
        ],
        [
            "engagedSessions",
            "Quantas sessões duraram mais de 10 segundos, tiveram um evento de conversão ou duas ou mais exibições de tela.",
        ],
        [
            "engagementRate",
            "A porcentagem de sessões engajadas (sessões engajadas divididas por sessões). Essa métrica é retornada como uma fração. Por exemplo, 0,7239 significa que 72,39% das sessões foram engajadas.",
        ],
        [
            "dauPerMau",
            "Porcentagem contínua de usuários ativos por 30 dias que também são usuários ativos por 1 dia. Essa métrica é retornada como uma fração. Por exemplo, 0,113 significa que 11,3% dos usuários ativos em 30 dias também foram ativos por 1 dia.",
        ],
        [
            "dauPerWau",
            "Porcentagem contínua de usuários ativos por 7 dias que também são usuários ativos por 1 dia. Essa métrica é retornada como uma fração. Por exemplo, 0,082 significa que 8,2% dos usuários ativos em 7 dias também foram ativos por 1 dia.",
        ],
    ];

    const percentValues = [
        "bounceRate",
        "engagementRate",
        "dauPerMau",
        "dauPerWau",
    ];

    analytics({
        dim: "date",
        met: metricsDescription,
        percentValues,
        startDate,
        endDate,
        sheetName: "[site-ga4] Engajamento",
        sheetID: CONFIG.ids.sheet(),
    });
}

function analytics({
    dim,
    met,
    percentValues,
    startDate,
    endDate,
    sheetName,
    sheetID,
}) {
    try {
        const dimensions = analyticsDimensions(dim);

        const metrics = analyticsMetrics(...met.map((m) => m[0]));

        const dateRange = analyticsDateRange(startDate, endDate);

        const orderBy = analyticsOrderBy(dimensions[0]);

        const request = analyticsRequest({
            dimensions,
            metrics: [metrics],
            dateRange,
            orderBy,
        });

        const response = AnalyticsData.Properties.runReport(
            request,
            "properties/" + CONFIG.ids.analytics()
        );

        const header = [
            ["date", ...met.map((m) => m[0])],
            ["", ...met.map((m) => m[1])],
        ];

        const lines = response.rows.map((row) => {
            return [
                row.dimensionValues[0].value,
                ...row.metricValues.map((m, i) => {
                    if (percentValues.includes(met[i][0]))
                        return (m.value * 100).toFixed(2);

                    if (met[i][0] === "sessionsPerUser")
                        return (m.value * 1).toFixed(2);

                    return m.value;
                }),
            ];
        });

        const Insights = [...header, ...lines];

        transportaParaPlanilha({
            Insights,
            sheetName,
            sheetID,
        });
    } catch (error) {
        console.error(error);
    }
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
