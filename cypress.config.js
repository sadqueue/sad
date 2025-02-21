const fs = require("fs");

module.exports = {
  // ...(on, config) => {
  //   on("task", {
  //     logToServer(message) {
  //       console.log("Cypress Log:", message);

  //       // Write to a file (optional)
  //       fs.appendFileSync("test_output.log", message + "\n");

  //       // TODO: Send logs to Firebase or a backend API instead of file
  //       return null;
  //     },
  //   });
  // },

  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        logToFile({ filename, message }) {
          fs.appendFileSync(filename, message + '\n');
          return null; // Cypress requires returning something
        }
      });
    }
  }
};
