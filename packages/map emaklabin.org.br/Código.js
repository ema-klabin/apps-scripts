function getTags() {
  const params = {
    _fields: "id,name,link,parent,count",
    per_page: 3000,
  };
  const API = new Core.API.EK_API();
  const tags = API.getTags(params);

  const config = {
    ...Core.CONFIG.config,
    sheetName: Core.CONFIG.endpoints.tags,
    colLength: Object.keys(tags[0]).length,
  };

  addSheetHeader(config, tags[0]);

  tags.map((tag, i) => {
    const configValues = {
      ...config,
      rowStart: config.rowStart + 1 + i,
      colLength: Object.keys(tag).length,
    };
    addToSheet(configValues, tag);
  });
}

function getCategories() {
  const params = {
    _fields: "id,name,link,parent,count",
    per_page: 1000,
  };
  const API = new Core.API.EK_API();
  const categorias = API.getCategories(params);

  const config = {
    ...Core.CONFIG.config,
    sheetName: Core.CONFIG.endpoints.categorias,
    colLength: Object.keys(categorias[0]).length,
  };

  addSheetHeader(config, categorias[0]);

  categorias.map((categoria, i) => {
    const configValues = {
      ...config,
      rowStart: config.rowStart + 1 + i,
      colLength: Object.keys(categoria).length,
    };
    addToSheet(configValues, categoria);
  });
}

function getPosts() {
  const params = {
    _fields: "id,title,author,date,link,status",
    per_page: 1000,
  };
  const API = new Core.API.EK_API();
  const posts = API.getPosts(params);

  const config = {
    ...Core.CONFIG.config,
    sheetName: Core.CONFIG.endpoints.posts,
    colLength: Object.keys(posts[0]).length,
  };

  addSheetHeader(config, posts[0]);

  posts.map((post, i) => {
    const configValues = {
      ...config,
      rowStart: config.rowStart + 1 + i,
      colLength: Object.keys(post).length,
    };
    addToSheet(configValues, post);
  });
}

function getPages() {
  const params = {
    _fields: "id,title,author,date",
    per_page: 100,
  };
  const API = new Core.API.EK_API();
  const pages = API.getPages(params);

  const config = {
    ...Core.CONFIG.config,
    sheetName: Core.CONFIG.endpoints.paginas,
    colLength: Object.keys(pages[0]).length,
  };

  addSheetHeader(config, pages[0]);

  pages.map((page, i) => {
    const configValues = {
      ...config,
      rowStart: config.rowStart + 1 + i,
      colLength: Object.keys(page).length,
    };
    addToSheet(configValues, page);
  });
}

function addToSheet(config, page) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    config.sheetName
  );
  if (null == sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    sheet.setName(config.sheetName);
  }
  const range = sheet.getRange(
    config.rowStart,
    config.colStart,
    config.rowLength,
    config.colLength
  );

  const values = Object.entries(page).map((entry, i) => {
    if ("title" === entry[0]) {
      return entry[1].rendered;
    }
    return entry[1];
  });

  range.setValues([values]);
}

function addSheetHeader(config, page) {
  console.log(config);
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    config.sheetName
  );

  if (null == sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    sheet.setName(config.sheetName);
  }

  const range = sheet.getRange(
    config.rowStart,
    config.colStart,
    config.rowLength,
    config.colLength
  );

  const values = Object.entries(page).map((entry, i) => {
    return entry[0];
  });
  range.setValues([values]);

  const formulasRange = sheet.getRange(
    config.rowStart - 2,
    config.colStart,
    1,
    2
  );
  const formulasValues = [
    [`=COUNTUNIQUE(B${config.rowStart + 1}:B)`, new Date()],
  ];
  formulasRange.setValues(formulasValues);
}
