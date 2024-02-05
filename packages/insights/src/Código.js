function instagram() {
    const metrics = [
        "impressions",
        // 'follower_count',
        "reach",
        "email_contacts",
        "get_directions_clicks",
        "phone_call_clicks",
        "profile_views",
        "website_clicks",
    ];

    instaInsights({
        metrics,
        startDate,
        endDate,
        sheetName: "Instagram",
        sheetID: CONFIG.ids.sheet(),
    });
}

function facebook() {
    const metrics = [
        "page_engaged_users",
        "page_post_engagements",
        "page_impressions",
        "page_impressions_paid",
        "page_impressions_organic_v2",
        "page_actions_post_reactions_like_total",
        "page_video_views",
    ];

    pageInsights({
        metrics,
        startDate,
        endDate,
        sheetName: "Facebook",
        sheetID: CONFIG.ids.sheet(),
    });
}

function newsletter() {
    const rest = new RestAPI({
        base: "api.egoiapp.com",
        headers: {
            Apikey: CONFIG.tokens.egoi(),
        },
    });

    const lists = rest.get({
        endpoint: "lists",
    });

    const campaigns = rest.get({
        endpoint: "campaigns",
        params: {
            channel: "email",
            created_min: `${startDate} 00:00:00`,
            created_max: `${endDate} 23:59:00`,
            status: "sent",
        },
    });

    const Campanhas = campaigns.items.map((campaign) => {
        const list = lists.items.find((list) => {
            return list.list_id === campaign.list_id;
        });

        const report = rest.get({
            endpoint: `reports/email/${campaign.campaign_hash}`,
        });

        return [
            campaign.campaign_hash,
            campaign.title,
            campaign.start_date,
            list.internal_name,
            report.overall.sends,
            report.overall.opens,
            report.overall.unique_opens,
            report.overall.clicks,
            report.overall.unique_clicks,
            report.overall.hard_bounces,
            report.overall.soft_bounces,
            report.overall.complaints,
            report.overall.unsubscriptions,
        ];
    });

    Campanhas.unshift([
        "hash",
        "Título campanha",
        "Data de envio",
        "Nome da lista",
        "overall.sends",
        "overall.opens",
        "overall.unique_opens",
        "overall.clicks",
        "overall.unique_clicks",
        "overall.hard_bounces",
        "overall.soft_bounces",
        "overall.complaints",
        "overall.unsubscriptions",
    ]);

    transportaParaPlanilha({
        Insights: Campanhas,
        sheetName: "Campanhas",
        sheetID: CONFIG.ids.sheet(),
    });
}

/**
 * Com problemas
 */
function youtube() {
    const metrics = [
        "views",
        "estimatedMinutesWatched",
        "averageViewDuration",
        "subscribersGained",
    ];

    const report = YouTubeAnalytics.Reports.query({
        ids: `channel==${CONFIG.ids.youtube()}`,
        startDate,
        endDate,
        metrics: metrics.join(","),
        dimensions: "day",
        sort: "day",
    });

    console.log(report);
}

function analytics() {
    try {
        const propertyID = "394335323";

        const dimensions = analyticsDimensions("date");

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
                "sessionsPerUser",
                "Número médio de sessões por usuário (sessões divididas por usuários ativos).",
            ],
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

        const metrics = analyticsMetrics(
            ...metricsDescription.map((m) => m[0])
        );

        const dateRange = analyticsDateRange(startDate, endDate);

        const orderBy = analyticsOrderBy(dimensions[0]);

        const request = analyticsRequest({
            dimensions,
            metrics: [metrics],
            dateRange,
            orderBy,
        });

        // console.log({ dimensions, metrics, dateRange, orderBy, request });

        const response = AnalyticsData.Properties.runReport(
            request,
            "properties/" + propertyID
        );

        for (const row of response.rows) {
            console.log({
                dimension: row.dimensionValues,
                metrics: row.metricValues,
            });
        }
    } catch (error) {
        console.error(error);
    }
}
