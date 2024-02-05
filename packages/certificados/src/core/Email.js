class Email {
  constructor(form) {
    this.parseForm(form);
  }

  parseForm(form) {
    Object.entries(form).forEach(([key, value]) => {
      if (key.startsWith("Email")) {
        this[key.slice(key.indexOf("::") + 2)] = value;
      }
    });
  }

  async sendEmail(linha, endereco, attachments) {
    await GmailApp.sendEmail(endereco, this.assunto, this.msg, {
      cc: this.cc,
      ccp: this.cco,
      attachments,
    });
    this.setStatus(linha);
  }

  setStatus(linha) {
    const planilha = new Planilha();
    planilha.setCell(
      linha,
      9,
      "email enviado em: " + new Date().toLocaleString()
    );
  }
}
