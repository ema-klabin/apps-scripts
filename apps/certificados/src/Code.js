function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  const menu = SpreadsheetApp.getUi().createAddonMenu();
  if (e && e.authMode == ScriptApp.AuthMode.NONE) {
    menu.addItem("Autenticar", "authenticate");
    menu.addToUi();
  } else {
    const app = new App();
    app.setupSidebar();
  }
}

function authenticate() {
  console.log("login");
}

function createApp(formObject) {
  const app = new App(CONFIG.App.range());
  app.setupApp(formObject);
  return app;
}

function pagHome() {
  const app = new App();
  app.pagApp();
}

function pagCertificate() {
  try {
    const app = new App();
    app.pagCertificate();
  } catch (error) {
    console.log(error);
  }
}

function pagClients() {
  try {
    const app = new App(CONFIG.App.range());
    app.pagClients();
  } catch (error) {
    console.log(error);
  }
}

function pagSend() {
  try {
    const app = new App(CONFIG.App.range());
    app.pagSend();
  } catch (error) {
    console.log(error);
  }
}

function createCertificates() {
  const app = new App(CONFIG.App.range());
  const cert = app.createCertificate();
  if (cert) {
    app.setClientsConfigured(true);
    app.setCertificatesCreated(true);
    app.pagSend();
  } else if (cert instanceof Error) {
    return cert;
  }
}

function enviaCertificados(form) {
  const app = new App(CONFIG.App.range);
  app.enviaCertificados(form);
}

function hasAppStarted() {
  const app = new App();
  return app.hasAppStarted();
}

function hasCertificatesCreated() {
  const app = new App();
  return app.hasCertificatesCreated();
}

function isClientsConfigured() {
  const app = new App();
  return app.isClientsConfigured();
}

/**
 * Retorna os metadados do certificado
 * @returns {Object}
 */
function getCertificadoMeta() {
  const certificado = new Certificado(CONFIG.Certificado.range());
  const atividade = new Atividade(CONFIG.Atividade.range());
  const ministrantes = new Ministrantes(CONFIG.Ministrantes.rangeStart());

  const certificadoConfig = {
    certificado: certificado.getMeta(),
    atividade: atividade.getMeta(),
    ministrantes: ministrantes.getMeta(),
  };

  return certificadoConfig;
}
