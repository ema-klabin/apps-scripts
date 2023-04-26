class Util {
  static traduzData(data, from = "en", to = "pt") {
    return this.traduzir(
      Utilities.formatDate(data, "GMT-03:00", "d MMM YYYY"),
      from,
      to
    );
  }

  static data(data) {
    return Utilities.formatDate(data, "GMT-03:00", "dd/MM/yyyy");
  }

  static dataHora(data) {
    const newData = Utilities.formatDate(
      data,
      "GMT-03:00",
      "YYYY-MM-dd HH:mm:ss"
    );
    return this.traduzir(newData, "en", "pt");
  }

  static dataInput(data) {
    const newData = Utilities.formatDate(data, "GMT-03:00", "YYYY-MM-dd");
    return newData;
  }

  static traduzir(string, from, to = "pt") {
    return LanguageApp.translate(string, from, to);
  }

  static randomName() {
    return [...Array(7)].map(() => Math.random().toString(36)[2]).join("");
  }
}
