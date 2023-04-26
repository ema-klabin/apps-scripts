class App {
  constructor(range) {
    console.log("Iniciando App", new Date());
    this.range = range;
  }

  /**
   * Sidebar principal
   */
  setupSidebar() {
    const menu = SpreadsheetApp.getUi().createAddonMenu();
    menu.addItem("Iniciar", "App.prototype.pagApp");
    menu.addToUi();
  }

  /**
   * Exibe a página principal do app
   */
  pagApp() {
    const html = HtmlService.createTemplateFromFile("core/HTML/app/index");
    const output = html.evaluate();
    output.setTitle("App Certificados");
    this.showSidebar(output);
  }

  /**
   * Exibe a página de clientes
   */
  pagClients() {
    const html = HtmlService.createTemplateFromFile("core/HTML/clients/index");
    const output = html.evaluate();
    output.setTitle("Clientes");
    this.showSidebar(output);
  }

  /**
   * Exibe a página de envio de certificados
   */
  pagSend() {
    const html = HtmlService.createTemplateFromFile("core/HTML/send/index");
    const output = html.evaluate();
    output.setTitle("Enviar Certificados");
    this.showSidebar(output);
  }

  /**
   * Função para exibir o html na sidebar
   * @param html
   */
  showSidebar(html) {
    SpreadsheetApp.getUi().showSidebar(html);
  }

  /**
   *
   * @param formObject
   * @returns
   */
  setupApp(formObject) {
    const planilha = new Planilha();
    planilha.cleanAppRange();

    console.log("setupApp init", { formObject });

    /**
     * Configura os ministrantes
     */
    const ministranteConfig = Object.entries(formObject).filter((value) => {
      if (value[0].startsWith("Ministrante")) {
        value[0] = value[0].slice(value[0].indexOf("::") + 2);
        return value;
      }
    });
    const ministrantes = new Ministrantes();
    ministranteConfig.map((config) => {
      if (config[0].includes("-")) {
        const random = config[0].slice(config[0].indexOf("-") + 1);
        if (config[0].includes(random)) {
          const Min = ministrantes.addMinistrante(random);
          if (config[0].includes("nome")) {
            Min.setProp("nome", config[1]);
          }
          if (config[0].includes("email")) {
            Min.setProp("email", config[1]);
          }
        }
      }
    });
    this.ministrantes = ministrantes;

    /**
     * Configura a atividade
     */
    const datas = [];
    const atividadeConfig = Object.entries(formObject).filter((value) => {
      if (value[0].startsWith("Atividade")) {
        value[0] = value[0].slice(value[0].indexOf("::") + 2);
        if (value[0].startsWith("data")) {
          datas.push(value[1]);
        } else {
          return value;
        }
      }
    });
    atividadeConfig.push(["datas", datas]);

    atividadeConfig.push(["imagem", CONFIG.Atividade.imagem.id]);
    atividadeConfig.push(["url", CONFIG.Atividade.imagem.url]);

    const atividade = new Atividade();
    atividade.mount(atividadeConfig);
    this.atividade = atividade;

    /**
     * Configura o certificado
     */
    const certificadoConfig = Object.entries(formObject).filter((value) => {
      if (value[0].startsWith("Certificado")) {
        value[0] = value[0].slice(value[0].indexOf("::") + 2);
        return value;
      }
    });
    const certificado = new Certificado();
    certificado.mount(certificadoConfig);
    this.certificado = certificado;

    planilha.setData({
      certificado: this.certificado,
      atividade: this.atividade,
      ministrantes: this.ministrantes,
    });
    planilha.formatSheet();
    this.setStarted();

    /**
     * Retorna
     */
    return this;
  }

  /**
   * Retorna o app configurado
   * @returns App
   */
  setupAppFromSheet() {
    console.log("App.setupCertificadoFromSheet");
    const planilha = new Planilha();
    const data = planilha.getData();
    const clients = planilha.getClients();
    // const certificado = new Certificado();
    // certificado.setupFromSheet();
    // return certificado;
  }

  getClients() {
    const planilha = new Planilha();
    const data = planilha.getData();
  }

  createCertificado() {
    const planilha = new Planilha();
    const data = planilha.getData();
    const clients = planilha.getClients();
    const slide = new Slide(CONFIG.Slide.templateId, CONFIG.Slide.folderId);

    slide.setData(data);
    slide.setClients(clients);
    slide.createSlides("participante");
  }

  /**
   * Define o app como iniciado
   *
   * Esse método só deve ser usado quando o certificado é definido e a planilha está configurada.
   */
  setStarted() {
    PropertiesService.getDocumentProperties().setProperty(
      this.getPropName(),
      "true"
    );
  }

  /**
   * Nome da propriedade salva quando o certificado está configurado
   * @returns cert_configurado
   */
  getPropName() {
    return "cert_configurado";
  }
}
