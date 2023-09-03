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
