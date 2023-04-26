class HTML {
  static include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  }

  static menu() {
    return HtmlService.createHtmlOutputFromFile("core/HTML/menu").getContent();
  }

  static status() {
    return HtmlService.createHtmlOutputFromFile(
      "core/HTML/status"
    ).getContent();
  }
}
