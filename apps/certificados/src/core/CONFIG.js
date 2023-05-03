const CONFIG = {
  App: {
    range: () =>
      PropertiesService.getScriptProperties().getProperty("app_range"),
  },
  Certificado: {
    range: () =>
      PropertiesService.getScriptProperties().getProperty("certificado_range"),
  },
  Atividade: {
    range: () =>
      PropertiesService.getScriptProperties().getProperty("atividade_range"),
    imagem: {
      id: () =>
        PropertiesService.getScriptProperties().getProperty(
          "atividade_imagem_id"
        ),
      url: () =>
        PropertiesService.getScriptProperties().getProperty(
          "atividade_imagem_url"
        ),
    },
  },
  Ministrantes: {
    rangeStart: () =>
      PropertiesService.getScriptProperties().getProperty(
        "ministrantes_range_start"
      ),
  },
  Participantes: {
    range: () =>
      PropertiesService.getScriptProperties().getProperty(
        "participantes_range"
      ),
  },
  Slide: {
    templateUrl: () =>
      PropertiesService.getScriptProperties().getProperty("slide_template_url"),
    templateId: () =>
      PropertiesService.getScriptProperties().getProperty("slide_template_id"),
    folderId: () =>
      PropertiesService.getScriptProperties().getProperty("slide_folder_id"),
  },
};
