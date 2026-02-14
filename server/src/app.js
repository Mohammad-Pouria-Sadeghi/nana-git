// app.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

// Routers
const apiRouter = require("./routes/api");
console.log("path::???>>>", path.join(__dirname, "..", "public", "index.html"));

const app = express();

/* ---------------------- Global Middlewares ---------------------- */

app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("short"));
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "..", "public")));

/* --------------------------- API Routes -------------------------- */

// Versioned API
app.use("/v1", apiRouter);

/* --------------------------- SPA Fallback ------------------------ */
// If no API route matched, send index.html (for React frontend)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

/* ---------------------------------------------------------------- */

module.exports = app;
