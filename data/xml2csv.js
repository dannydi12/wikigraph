const fs = require("fs");
const sax = require("sax");

// REPLACE WITH YOUR XML FILE PATH
const WIKIPEDIA_XML_DUMP_FILE = "wiki.xml";

const parser = sax.createStream(true, { trim: true, strictEntities: true });
const links = fs.createWriteStream("links.csv");

// setup headers
links.write("from_title_id,to_title_id,to_title");

let currentElement = {};
let currentKey = "";
let count = 0;

parser.on("opentag", (node) => {
  if (node.name === "title") {
    currentKey = node.name;
    return;
  }

  if (node.name === "text") {
    currentKey = node.name;
    return;
  }

  currentKey = null;
});

parser.on("text", (text) => {
  if (currentKey == null) {
    return;
  }

  if (currentKey === "title") {
    currentElement[currentKey] = text;
    return;
  }

  if (currentKey === "text") {
    const extractedText = [];
    const matches = text.matchAll(/\[\[(.*?)(\|.*?)?\]\]/g);

    for (const match of matches) {
      extractedText.push(match[1]);
    }

    currentElement.linksTo = extractedText;
    return;
  }
});

/**
 *
 * @param {string} field
 * @returns {string}
 */
function escapeCSVField(field) {
  if (!field) {
    return "";
  }

  // If the field contains double quotes, double them up
  if (field.includes('"')) {
    field = field.replace(/"/g, '""');
  }

  // If the field contains commas or double quotes, enclose it within double quotes
  if (field.includes(",") || field.includes('"')) {
    field = `"${field}"`;
  }

  return field;
}

parser.on("closetag", (tag) => {
  if (tag === "page") {
    const titleId = escapeCSVField(currentElement.title).toLowerCase();

    if (currentElement.linksTo) {
      for (const link of currentElement.linksTo) {
        const toTitleId = escapeCSVField(link.toLowerCase())
        const toTitleFormatted = escapeCSVField(link)
        links.write(`\n${titleId},${toTitleId},${toTitleFormatted}`);
      }
    }

    currentElement = {};

    count++;

    // statistics
    if (count % 1000 === 0) {
      console.log(`Processed ${count} documents`);
    }
  }
});

parser.on("end", () => {
  links.close();
});

fs.createReadStream(WIKIPEDIA_XML_DUMP_FILE).pipe(parser);
