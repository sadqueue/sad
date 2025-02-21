// server.js
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies

// Create a route to handle test execution
app.post('/run-test', async (req, res) => {
  try {
    const { testCode } = req.body;
    
    if (!testCode) {
      return res.status(400).json({ error: 'No test code provided' });
    }

    // Create a unique directory for this test run
    const testDir = "/Users/m0l01bz/Desktop/workspace/sadqueue.github.io/cypress/e2e"; //path.join(__dirname, 'temp-tests');
    const testFileName = "spec.cy.js"; //`test-${Date.now()}.cy.js`;
    const testFilePath = path.join(testDir, testFileName);

    // Ensure the temp-tests directory exists
    await fs.mkdir(testDir, { recursive: true });

    // Write the test code to a temporary file
    await fs.writeFile(testFilePath, testCode);

    // Execute the Cypress test

    console.log("------", `npx cypress run --spec "${testFilePath}" --reporter json`)
    exec(
      `npx cypress run --spec "${testFilePath}" --reporter json`,
      { maxBuffer: 1024 * 1024 * 10 }, // 10MB buffer
      async (error, stdout, stderr) => {
        try {
          // Clean up: delete the temporary test file
          await fs.unlink(testFilePath);

          if (error) {
            console.error('Test execution error:', error);
            return res.status(500).json({
              error: 'Test execution failed',
              details: stderr,
              stdout: stdout
            });
          }

          try {
            // Parse and send the test results
            const results = JSON.parse(stdout);
            res.json({
              success: true,
              results: results,
              stats: {
                passes: results.stats?.passes || 0,
                failures: results.stats?.failures || 0,
                duration: results.stats?.duration || 0,
                tests: results.stats?.tests || 0
              }
            });
          } catch (parseError) {
            res.status(500).json({
              error: 'Failed to parse test results',
              details: stdout
            });
          }
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
          // Still send response even if cleanup fails
          res.status(500).json({
            error: 'Test cleanup failed',
            details: cleanupError.message
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

let testLogs = []; // Store logs in memory (or Firebase)

// Endpoint to receive logs from Cypress
app.post("/log", (req, res) => {
    const { message } = req.body;
    testLogs.push(message);
    console.log("Received Log:", message);
    res.sendStatus(200);
});

// Endpoint to fetch logs for display on the website
app.get("/logs", (req, res) => {
    res.json(testLogs);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test execution endpoint: http://localhost:${PORT}/run-test`);
});

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});