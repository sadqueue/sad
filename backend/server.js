import express from "express";
import cors from "cors";
import { exec } from "child_process";

const app = express();
const PORT = 300;

app.use(cors());
app.use(express.json());

app.post("/run-cypress", (req, res) => {
    exec("cypress run --spec cypress/e2e/v2.0_composite_vs_main.cy.js", (error, stdout, stderr) => {
        if (error) {
            res.json({ success: false, error: stderr });
        } else {
            res.json({ success: true, output: stdout });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
