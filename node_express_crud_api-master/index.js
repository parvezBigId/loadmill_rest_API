import express from "express";
import bodyParser from "body-parser";
import serveIndex from "serve-index";

import fileRoutes from "./routes/files.js";

const app = express();
const PORT = 30899;

app.use(bodyParser.json());

// app.use('/Remediation', 
//   express.static('Remediation'), 
//   serveIndex('Remediation', { icons: true })
//   )
app.use("/fs", fileRoutes);
app.get("/", (req, res) => res.send("Welcome to the Users API!🚀😎 "));
app.all("*", (req, res) => res.send("You've tried reaching a route that doesn't exist."));

app.listen(PORT, () => console.log(`Server running on the port: http://localhost:${PORT}`));
