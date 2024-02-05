const CONFIG = {
    tokens: {
        egoi: () =>
            PropertiesService.getScriptProperties().getProperty("token_egoi"),
        graphAPI: () =>
            PropertiesService.getScriptProperties().getProperty(
                "token_graphAPI"
            ),
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
    },
    // App: {
    //     range: () =>
    //         PropertiesService.getScriptProperties().getProperty("app_range"),
    // },
};
