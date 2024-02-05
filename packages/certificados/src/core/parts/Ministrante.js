class Ministrante {
  constructor() {
    console.log("Iniciando Ministrante", new Date());
    const random = Util.randomName();
    this._meta = [
      {
        type: "text",
        label: "Nome",
        atts: {
          name: this.metaName("nome") + "-" + random,
        },
      },
      {
        type: "text",
        label: "Email",
        atts: {
          name: this.metaName("email") + "-" + random,
        },
      },
    ];
  }

  setProp(prop, value) {
    this[prop] = value;
  }

  metaName(name) {
    return `${this.constructor.name}::${name}`;
  }

  getMeta() {
    return this._meta;
  }
}
