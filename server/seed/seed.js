const fs = require("fs");
const readline = require("readline");
const { processData, initDB } = require("./db");
const { Worker } = require("worker_threads");

const inputFile = "../../jsoutput.json"; // Replace with your large JSON file

const numWorkers = 10; // Adjust the number of worker threads as needed

// Create an array to store worker data
const workerDataArray = [];
for (let i = 0; i < numWorkers; i++) {
  workerDataArray.push({ workerId: i });
}

const workerResults = [];
let currentWorker = 0;

// Create and start worker threads
const workers = workerDataArray.map((workerData) => {
  const worker = new Worker("./worker.js", { workerData });
  worker.on("message", (message) => {
    workerResults.push(message);
  });
  return worker;
});

const main = async () => {
  await initDB();
  const readStream = fs.createReadStream(inputFile, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  let currentPage = "";

  for await (const line of rl) {
    if (line === "[" || line === "]") {
      continue;
    }

    const isEndOfObject = line === "}," || line === "}";
    currentPage += isEndOfObject ? "}" : line;

    if (isEndOfObject) {
      const data = JSON.parse(currentPage);
      currentPage = "";
      await processData(data);
      workers[currentWorker].postMessage({ data });
      currentWorker = (currentWorker + 1) % numWorkers;
    }
  }
  
  // done
  for (const worker of workers) {
    worker.postMessage({ done: true });
  }
};

main();
