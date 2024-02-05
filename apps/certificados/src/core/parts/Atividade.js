class Atividade {
  constructor() {
    console.log("Iniciando Atividade", new Date());
    this.types = {
      curso: {
        label: "Curso",
        participante: "Participou do curso",
        ministrante: "Ministrou o curso",
      },
      palestra: {
        label: "Palestra",
        participante: "Participou da palestra",
        ministrante: "Ministrou a palestra",
      },
      "mesa-redonda": {
        label: "Mesa-redonda",
        participante: "Assistiu a mesa-redonda",
        ministrante: "Participou da mesa-redonda",
      },
      oficina: {
        label: "Oficina",
        participante: "Participou da oficina",
        ministrante: "Ministrou a oficina",
      },
      "xvi-encontro": {
        label: "XVI Encontro",
        participante: "Participou",
        ministrante: "Integrou",
        equipe: "Participou da produção",
      },
    };

    this._meta = [
      {
        type: "array",
        name: "datas",
        items: [
          {
            type: "date",
            label: "Data",
            atts: {
              name: this.metaName("data") + "-" + Util.randomName(),
            },
          },
        ],
      },
      {
        type: "text",
        label: "Nome",
        atts: {
          name: this.metaName("nome"),
        },
      },
      {
        type: "text",
        label: "Duração",
        atts: {
          name: this.metaName("duracao"),
        },
      },
      {
        type: "select",
        label: "Tipo",
        atts: {
          name: this.metaName("tipo"),
        },
        descricao: "Selecione o tipo de atividade",
        options: this.types,
      },
    ];
  }

  setupFromSheet() {
    const ministrantes = new Ministrantes();
    ministrantes.setupFromSheet();
    this.setMinistrantes(ministrantes);
    this.setNome(this.getSheet().getRange("B5").getValue());
    this.setDatas(this.getSheet().getRange("B6").getValue());
    this.setDuracao(this.getSheet().getRange("B7").getValue());
    this.setTipo(this.getSheet().getRange("B8").getValue());
    this.setImagem({
      id: this.getSheet().getRange("B9").getValue(),
      url: this.getSheet().getRange("B10").getValue(),
    });
    this.setAcao(this.getTipos()[this.getTipo()].acao);

    return this;
  }

  metaName(name) {
    return `${this.constructor.name}::${name}`;
  }

  mount(config) {
    config.map((value) => {
      if (value[0] === "datas") {
        this[value[0]] = value[1].toString();
      } else if (value[0] === "tipo") {
        this.acao = this.types[value[1]];
        this[value[0]] = value[1];
      } else {
        this[value[0]] = value[1];
      }
    });
  }

  getMeta() {
    return this._meta;
  }
}
