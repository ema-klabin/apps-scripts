function onOpen() {
  const app = new App();
  app.setupSidebar();
}

function createApp(formObject) {
  const app = new App(CONFIG.App.range);
  app.setupApp(formObject);
  return app;
}

function pagHome() {
  const app = new App();
  app.pagApp();
}

function pagCertificate() {
  const app = new App(CONFIG.App.range);
  app.pagCertificate();
}

function pagClients() {
  const app = new App(CONFIG.App.range);
  app.pagClients();
}

function pagSend() {
  const app = new App(CONFIG.App.range);
  app.pagSend();
}

function createCertificates() {
  const app = new App(CONFIG.App.configRange);
  app.createCertificado();
}

function enviaCertificados(form) {
  const app = new App(CONFIG.App.configRange);
  app.enviaCertificados(form);
}

function hasAppStarted() {
  const app = new App(CONFIG.App.range);
  return app.hasAppStarted();
}

function appStatus() {
  return {
    hasAppStarted: hasAppStarted(),
  };
}

/**
 * Retorna os metadados do certificado
 * @returns {Object}
 */
function getCertificadoMeta() {
  const certificado = new Certificado(CONFIG.Certificado.range);
  const atividade = new Atividade(CONFIG.Atividade.range);
  const ministrantes = new Ministrantes(CONFIG.Ministrantes.rangeStart);

  const certificadoConfig = {
    certificado: certificado.getMeta(),
    atividade: atividade.getMeta(),
    ministrantes: ministrantes.getMeta(),
  };

  return certificadoConfig;
}

// /**
//  *  Get the certificado data
//  * @returns {Object}
//  */
// function getCertificado() {
//   const app = new App(CONFIG.App.range);

//   if (hasAppStarted()) {
//     const data = app.setupAppFromSheet();
//   } else {
//     return getCertificadoMeta();
//   }
// }
