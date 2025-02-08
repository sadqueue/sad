const fs = require('fs');

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        logToFile(message) {
          const logFilePath = 'cypress/logs/test-output.log';
          fs.appendFileSync(logFilePath, message + '\n');
          return null;
        }
      });
    }
  }
};