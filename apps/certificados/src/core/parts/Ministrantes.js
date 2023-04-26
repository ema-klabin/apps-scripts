class Ministrantes {
  constructor() {
    console.log("Iniciando Ministrantes", new Date());
    this.ministrantes = {};
  }

  setSheet() {
    this.sheet = SpreadsheetApp.getActiveSheet();
  }

  getMeta() {
    const ministrante = new Ministrante();
    return [ministrante.getMeta()];
  }

  mount(config) {
    config.map((value) => {
      this.ministrantes[value[0]] = {
        nome: value[0],
        email: value[1],
      };
    });
  }

  addMinistrante(key) {
    if (!this.getMinistranteByKey(key)) {
      this.ministrantes[key] = new Ministrante();
    }
    return this.ministrantes[key];
  }

  getMinistranteByKey(key) {
    if (this.ministrantes[key]) {
      return this.ministrantes[key];
    } else {
      return false;
    }
  }
}
