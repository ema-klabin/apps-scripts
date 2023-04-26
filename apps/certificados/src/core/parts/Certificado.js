class Certificado {
  constructor() {
    console.log("Iniciando Certificado", new Date());

    this._meta = [
      {
        type: "date",
        label: "Data de emissão",
        atts: {
          name: this.metaName("dataEmissao"),
        },
      },
    ];
  }

  setupFromSheet() {
    this.setDataEmissao(this.getSheet().getRange("B2").getValue());
    return this;
  }

  mount(config) {
    config.map((value) => {
      this[value[0]] = value[1];
    });
  }

  metaName(name) {
    return `${this.constructor.name}::${name}`;
  }

  getMeta() {
    return this._meta;
  }
}
