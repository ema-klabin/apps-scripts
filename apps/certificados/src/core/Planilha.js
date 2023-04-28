class Planilha {
  constructor() {
    this.appRange = CONFIG.App.range;
    this.certicadoRange = CONFIG.Certificado.range;
    this.atividadeRange = CONFIG.Atividade.range;
    this.participantesRange = CONFIG.Participantes.range;
    this.ministrantesRangeStart = CONFIG.Ministrantes.rangeStart;
    this.setSheet();
  }

  /**
   * Define a planilha no app
   */
  setSheet() {
    this.sheet = SpreadsheetApp.getActiveSheet();
  }

  getSheet() {
    this.setSheet();
    return this.sheet;
  }

  getCell(row, col) {
    this.setSheet();
    return this.sheet.getRange(row, col).getValue();
  }

  setCell(row, col, value) {
    this.setSheet();
    this.sheet.getRange(row, col).setValue(value);
  }

  setData(data) {
    this.cleanAppRange();

    const certificado = Object.entries(data.certificado)
      .map(([name, value]) => {
        if ("_meta" === name) {
          return "";
        }
        if ("types" === name) {
          return "";
        }
        return [name, value];
      })
      .filter((value) => value);

    const atividade = Object.entries(data.atividade)
      .map(([name, value]) => {
        if ("_meta" === name) {
          return "";
        }
        if ("types" === name) {
          return "";
        }
        if ("acao" === name) {
          return "";
        }
        if (this.getAtividadeHeader()[0] === name) {
          return "";
        }
        return [name, value];
      })
      .filter((value) => value);

    const ministrantes = Object.values(data.ministrantes.ministrantes).map(
      (min) => {
        return ["nome" in min ? min.nome : "", "email" in min ? min.email : ""];
      }
    );

    certificado.unshift(this.getCertificadoHeader());
    atividade.unshift(this.getAtividadeHeader());
    ministrantes.unshift(this.getMinistrantesHeader());
    ministrantes.unshift([
      "Ministrantes",
      Object.keys(data.ministrantes.ministrantes).length,
    ]);
    this.getCertificadoRange().setValues(certificado);
    this.getAtividadeRange().setValues(atividade);
    this.getMinistrantesRange(ministrantes.length).setValues(ministrantes);
  }

  getAtividadeHeader(data) {
    return ["Atividade", data ? data : ""];
  }

  getCertificadoHeader(data) {
    return ["Certificado", data ? data : ""];
  }

  getMinistrantesHeader() {
    return ["Nome", "E-mail"];
  }

  getClients() {
    this.setSheet();
    const clients = this.sheet
      .getRange(this.participantesRange)
      .getValues()
      .filter((e) => e[0] !== "");
    return clients.map((client, index) => ({
      nome: client[0],
      email: {
        endereco: client[1],
        status: client[5],
      },
      pdf: {
        id: client[2],
        url: client[3],
        status: client[4],
      },
      linha: index + 2,
    }));
  }

  // return a object with the data from the sheet, the data is formatted as a array of array of string
  getData() {
    this.setSheet();
    const data = {
      certificado: new Certificado(),
      atividade: new Atividade(),
      ministrantes: new Ministrantes(),
    };
    const certificadoData = this.getCertificadoRange().getValues();
    const atividadeData = this.getAtividadeRange().getValues();
    const ministrantesData = this.getMinistrantesRange().getValues();
    data.certificado.mount(
      certificadoData.filter((e) => e[0] !== "Certificado")
    );
    data.atividade.mount(atividadeData.filter((e) => e[0] !== "Atividade"));
    data.ministrantes.mount(
      ministrantesData.filter((e) => e[0] !== "Ministrantes" && e[0] !== "Nome")
    );
    return data;
  }

  getCertificadoRange() {
    this.setSheet();
    return this.sheet.getRange(this.certicadoRange);
  }

  getAtividadeRange() {
    this.setSheet();
    return this.sheet.getRange(this.atividadeRange);
  }

  getMinistrantesRange(end) {
    this.setSheet();
    const total = !end ? this.getCell(12, 2) + 2 : end;
    return this.sheet.getRange(this.ministrantesRangeStart, 1, total, 2);
  }

  cleanAppRange() {
    return this.cleanRange(this.appRange);
  }

  cleanRange(rangeToClear) {
    this.setSheet();
    const rangeCleared = this.sheet.getRange(rangeToClear);
    rangeCleared.clearContent();
    return rangeCleared;
  }

  formatSheet() {
    this.setSheet();

    const cor = {
      preto: "#000",
      branco: "#fff",
      verde: "#006B62",
    };

    const config = this.sheet.getRange(this.appRange);
    config.setBackground(cor.verde);
    config.setFontColor(cor.branco);

    const configKeys = this.sheet.getRange("A:A");
    configKeys.setFontSize(10);
    this.sheet.setColumnWidth(1, 150);

    const configValues = this.sheet.getRange("B:B");
    configValues.setFontSize(9);
    configValues.setHorizontalAlignment("left");
    this.sheet.setColumnWidth(2, 350);

    const headerValues = [
      "nome",
      "e-mail",
      "pdf-id",
      "pdf-url",
      "pdf-status",
      "email-status",
    ];

    const header = this.sheet.getRange(1, 4, 1, headerValues.length);
    header.clearContent().setValues([headerValues]);
    header.setBackground(cor.preto);
    header.setFontColor(cor.branco);
    header.setVerticalAlignment("middle");

    this.sheet.setColumnWidth(3, 3);
    const sep = this.sheet.getRange("C:C");
    sep.setBackground(cor.preto);
  }

  /**
   * Verifica se o app está configurado
   * @returns | boolean
   */
  isConfigured() {
    if (undefined === this.range) {
      return false;
    } else {
      this.setSheet();
      const values = this.getSheet().getRange(this.appRange).getValues();
      if (values[1][1].toString().trim()) {
        return true;
      } else {
        return false;
      }
    }
  }
}
