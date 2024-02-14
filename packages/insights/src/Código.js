function runReports() {
    googleAnalyticsReport();
    downloadsReport();
    instagramReport();
    facebookReport();
    newsletterReport();
    // youtubeReport();
}

function instagramReport() {
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
        sheetName: "[redes] Instagram",
        sheetID: CONFIG.ids.sheet(),
    });
}

function facebookReport() {
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
        sheetName: "[redes] Facebook",
        sheetID: CONFIG.ids.sheet(),
    });
}

function newsletterReport() {
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
        sheetName: "[e-goi] Campanhas",
        sheetID: CONFIG.ids.sheet(),
    });
}

function googleAnalyticsReport() {
    analyticsAudienceReport();
    analyticsEngagementReport();
}

function downloadsReport() {
    downloads();
}

/**
 * Com problemas
 */
function youtubeReport() {
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
