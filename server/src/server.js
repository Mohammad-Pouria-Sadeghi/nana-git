// server.js
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = 9000;

const MONGO_URL =
  "mongodb+srv://pooria8099_db_user:wu4KjjQzADyMYNGQ@nasa-cluster.jmyvsru.mongodb.net/?appName=nasa-cluster";

// Log connection events
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

async function startServer() {
  // 1. Connect to MongoDB
  await mongoose.connect(MONGO_URL);

  // 2. Load planets from CSV (or DB later)
  await loadPlanetsData();

  // 3. Start server
  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
