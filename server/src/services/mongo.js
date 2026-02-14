const mongoose = require("mongoose");

// const MONGO_URL =
//   "mongodb+srv://pooria:yRngHijUhI6R0225@nasa-cluster.jmyvsru.mongodb.net/?appName=nasa-cluster";

// const MONGO_URL = process.env.MONGO_URL;
mongoose.connection.on("connected", () => {
  console.log("🔥 MongoDB connected!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
}); 

async function mongoConnect() {
  console.log("Connecting to MongoDB...");
  console.log("MONGO_URI:", process.env.MONGO_URL);

  await mongoose.connect(process.env.MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
