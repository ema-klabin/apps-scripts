class Slide {
  constructor(id, folderId) {
    this.map = {
      participante: 2,
      ministrante: 4,
    };
    this.id = id;
    this.folderId = folderId;
    this.setSlides();
  }

  setData(data) {
    this.data = data;
  }

  setClients(clients) {
    this.clients = clients;
  }

  createSlides(type) {
    const template = this.getSlides()[this.map[type]];
    const data = this.data;
    const clients = this.clients;
    const dates = data.atividade.datas
      .map((date) => {
        return Util.data(new Date(date));
      })
      .join(", ");

    const ministrantes = Object.values(data.ministrantes.ministrantes)
      .map((ministrante) => {
        console.log(ministrante);
        return ministrante.nome;
      })
      .join(", ");

    clients.forEach((client) => {
      this.new(data.atividade.nome);
      this.addSlide(template);
      this.replaceText(
        "certificado.dataEmissao",
        Util.traduzData(new Date(data.certificado.dataEmissao))
      );
      this.replaceText("atividade.nome", data.atividade.nome);
      this.replaceText("atividade.acao", data.atividade.acao[type]);
      this.replaceText("atividade.datas", dates);
      this.replaceImage("atividade.imagem", data.atividade.imagem);
      this.replaceText("atividade.duracao", data.atividade.duracao);
      this.replaceText("ministrante.nome", ministrantes);
      this.replaceText("participante.nome", client.nome);

      const fileName = `[certificado] ${data.atividade.nome} - ${client.nome} | Casa Museu Ema Klabin`;

      this.save(data.atividade.nome, fileName, client);
    });
  }

  setSlides() {
    this.slides = SlidesApp.openById(this.id).getSlides();
  }

  getSlides() {
    return this.slides;
  }

  getId() {
    return this.id;
  }

  replaceImage(find, replace) {
    const images = this.getTemplate().getSlides()[0].getImages();
    const image = images.filter((image) => {
      if (null !== image.getLink()) {
        return image.getLink().getUrl() === "#" + find ? image : null;
      }
    })[0];
    image.removeLink();
    const newImage = DriveApp.getFileById(replace);
    image.replace(newImage);
    return image;
  }

  getImage() {}

  getTemplate() {
    return this.template;
  }

  new(name) {
    return (this.template = SlidesApp.create(name));
  }

  addSlide(slide) {
    this.getTemplate().insertSlide(0, slide);
  }

  replaceText(find, replace) {
    this.getTemplate().replaceAllText("{{" + find + "}}", replace);
  }

  saveStatus(participante, File) {
    const planilha = new Planilha();
    // pdf ID
    planilha.setCell(participante.linha, 6, File.getId());

    // pdf URL
    planilha.setCell(participante.linha, 7, File.getUrl());

    // pdf Status
    planilha.setCell(
      participante.linha,
      8,
      `pdf criado em: ${Util.dataHora(new Date())}`
    );
  }

  save(folder, name, participante) {
    const Folder = DriveApp.getFolderById(this.folderId);

    const Template = this.getTemplate();

    Template.getSlides()[1].remove();

    const folders = Folder.getFoldersByName(folder);

    const abstractSave = (config) => {
      config.template.saveAndClose();
      const file = DriveApp.getFileById(config.template.getId());
      const newFile = config.folder.createFile(file.getBlob());
      this.saveStatus(config.participante, newFile);
      newFile.setName(config.name);
    };

    const config = {
      template: Template,
      folder: null,
      participante: participante,
      name: name,
    };

    if (folders.hasNext()) {
      while (folders.hasNext()) {
        const selectedFolder = folders.next();
        if (folder === selectedFolder.getName()) {
          config.folder = selectedFolder;
          abstractSave(config);
        }
      }
    } else {
      const newFolder = Folder.createFolder(folder);
      config.folder = newFolder;
      abstractSave(config);
    }
  }
}
