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

  pagCertificate() {
    try {
      const html = HtmlService.createTemplateFromFile(
        "core/HTML/certificate/index"
      );
      const output = html.evaluate();
      console.log("pagCertificate", { output });
      output.setTitle("Certificados");
      this.showSidebar(output);
    } catch (error) {
      console.log(error);
    }
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
    this.setAppStarted(false);
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
    this.setAppStarted(true);

    /**
     * Retorna
     */
    return this;
  }

  async createCertificate() {
    try {
      const planilha = new Planilha();
      const data = planilha.getData();
      const clients = planilha.getClients();
      if (clients) {
        const slide = new Slide(CONFIG.Slide.templateId, CONFIG.Slide.folderId);
        slide.setData(data);
        slide.setClients(clients);
        await slide.createSlides("participante");
        console.log("criado");
        return true;
      } else {
        throw new Error("No clients configured");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async enviaCertificados(form) {
    const planilha = new Planilha();
    const data = planilha.getData();
    const clients = planilha.getClients();

    clients.map(async (client) => {
      try {
        const pdf = await this.getPdf(client.linha);
        const email = new Email(form);
        await email.sendEmail(client.linha, client.email.endereco, [pdf]);
      } catch (error) {
        throw new Error(error);
      }
    });
  }

  async getPdf(linha) {
    try {
      const planilha = new Planilha();
      const id = planilha.getCell(linha, 6);
      const pdf = await DriveApp.getFileById(id).getAs("application/pdf");
      return pdf;
    } catch (error) {
      throw new Error(error);
    }
  }

  setAppStarted(status) {
    try {
      PropertiesService.getScriptProperties().setProperty(
        this.getPropName(),
        status.toString()
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  hasAppStarted() {
    try {
      const prop = PropertiesService.getScriptProperties().getProperty(
        this.getPropName()
      );
      if (prop) {
        return prop === "true";
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  setCertificatesCreated(status) {
    try {
      PropertiesService.getScriptProperties().setProperty(
        "certificates_created",
        status.toString()
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  setClientsConfigured(status) {
    try {
      PropertiesService.getScriptProperties().setProperty(
        "clients_configured",
        status.toString()
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  hasCertificatesCreated() {
    try {
      const prop = PropertiesService.getScriptProperties().getProperty(
        "certificates_created"
      );
      if (prop) {
        return prop === "true";
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  isClientsConfigured() {
    try {
      const prop =
        PropertiesService.getScriptProperties().getProperty(
          "clients_configured"
        );
      console.log(prop);
      if (prop) {
        return prop === "true";
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Nome da propriedade salva quando o certificado está configurado
   * @returns cert_app_starter
   */
  getPropName() {
    return "cert_app_started";
  }
}
