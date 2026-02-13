const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { MONGO_URL } = process.env;

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const planetsRouter = require("./routes/planets/planets.route");
const launchesRouter = require("./routes/launches/launches.router");

app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("short"));
app.use(express.json());
// await mongoose
//   .connect(
//     "mongodb+srv://pooria8099_db_user:wu4KjjQzADyMYNGQ@nasa-cluster.jmyvsru.mongodb.net/?appName=nasa-cluster",
//   )
//   .then((res) => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
