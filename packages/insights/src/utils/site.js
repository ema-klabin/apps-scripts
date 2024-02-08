function downloads() {
    const rest = new RestAPI({
        base: "https://emaklabin.org.br/wp-json",
        headers: {
            Authorization: `Bearer ${CONFIG.tokens.wpdm()}`,
        },
    });

    const downloads = rest.get({
        namespace: "wpdm/v1",
        endpoint: "packages",
        params: {
            number_of_posts: 100,
        },
    });

    const Downloads = downloads.map((download) => {
        return [
            download.id,
            `=HYPERLINK("${download.permalink}"; "${download.title}")`,
            download.date_created,
            download.package_size,
            download.download_count,
        ];
    });

    const DownloadsHeader = [
        "ID",
        "Título",
        "Data de publicação",
        "Tamanho arquivo",
        "Quantidade downloads",
    ];

    Downloads.unshift(DownloadsHeader);

    transportaParaPlanilha({
        Insights: Downloads,
        sheetName: "[site-wpdm] Downloads",
        sheetID: CONFIG.ids.sheet(),
    });
}
