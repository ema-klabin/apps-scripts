/**
 * Initialize the app
 */
function onOpen() {
  const app = new App();
  app.setupSidebar();
}

function createApp(formObject) {
  const app = new App(CONFIG.App.range);
  console.log({ formObject });
  app.setupApp(formObject);
  return app;
}

function pagHome() {
  const app = new App();
  app.pagApp();
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
  // Certificado.setParticipantesFromSheet();
  // console.log('criarCertificados', Certificado);

  // Certificado.criarCertificados();
  // App._log();
  // pagSend();
  // return Certificado;
}

/**
 *  Get the certificado data
 * @returns {Object}
 */
function getCertificado() {
  const app = new App(CONFIG.App.range);

  // const isConfigured = app.isConfigured();
  const isConfigured = false;

  if (isConfigured) {
    const cert = app.setupAppFromSheet();
    const atividade = cert.getAtividade();
    const ministrantes = atividade.getMinistrantes();

    const response = {
      certificado: cert.getMetaMerge(),
      atividade: atividade.getMetaMerge(),
      ministrantes: ministrantes.getMetaMerge(),
    };
    return response;
  } else {
    return getCertificadoMeta();
  }
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
