const CONFIG = {
    keys: {
        trello: () =>
            PropertiesService.getScriptProperties().getProperty("key_trello"),
    },
    tokens: {
        egoi: () =>
            PropertiesService.getScriptProperties().getProperty("token_egoi"),
        graphAPI: () =>
            PropertiesService.getScriptProperties().getProperty(
                "token_graphAPI"
            ),
        wpdm: () =>
            PropertiesService.getScriptProperties().getProperty("token_wpdm"),
        trello: () =>
            PropertiesService.getScriptProperties().getProperty("token_trello"),
    },
    ids: {
        sheet: () =>
            PropertiesService.getScriptProperties().getProperty("id_sheet"),
        fbPage: () =>
            PropertiesService.getScriptProperties().getProperty("id_fbPage"),
        insta: () =>
            PropertiesService.getScriptProperties().getProperty("id_insta"),
        youtube: () =>
            PropertiesService.getScriptProperties().getProperty("id_youtube"),
        analytics: () =>
            PropertiesService.getScriptProperties().getProperty("id_analytics"),
    },
};
