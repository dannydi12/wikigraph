const { parentPort } = require("worker_threads");
const { processData } = require("./db");

parentPort.on("message", async (message) => {
  if (message.data) {
    // Process the data
    await processData(message.data)
  } else if (message.done) {
    // Terminate the worker thread
    parentPort.close();
  }
});
