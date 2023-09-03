const fs = require("fs");
const sax = require("sax");

// Replace 'input.xml' and 'output.json' with your file paths
const xmlFilePath =
  "/Volumes/The Other One/enwiki-20230820-pages-articles-multistream.xml";
const jsonFilePath = "jsoutput.json";

const parser = sax.createStream(true, { trim: true, strictEntities: true });
const output = fs.createWriteStream(jsonFilePath);

const start = new Date().valueOf();

output.write("[");

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

/**
 * might be unecessary
 * 
 * @param {string} input
 * @returns
 */
function unescapeUnicode(input) {
  const unicodeRegEx = /\\u[\dA-Fa-f]{4}/g;
  if (new RegExp(unicodeRegEx).test(match)) {
    return;
  }

  return input.replace(unicodeRegEx, (match) =>
    String.fromCharCode(parseInt(match.substr(2), 16))
  );
}

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
      const unescaped = unescapeUnicode(match[1]);
      extractedText.push(unescaped);
    }

    currentElement.linksTo = extractedText;
    return;
  }
});

let firstElement = true;
const buildSeparator = () => {
  if (firstElement) {
    firstElement = false;
    return `\n`;
  }

  return `,\n`;
};

parser.on("closetag", (tag) => {
  if (tag === "page") {
    const pageData = JSON.stringify(currentElement, null, 2);
    const separator = buildSeparator();

    output.write(separator + pageData);
    currentElement = {};

    // statistics
    count++;
    console.log("Completed #" + count);
  }
});

parser.on("end", () => {
  output.write("\n]");

  // statistics
  const end = new Date().valueOf();
  const timePassed = end - start;
  console.log("Done in" + new Date(timePassed).getMinutes());

  output.close();
});

fs.createReadStream(xmlFilePath).pipe(parser);
