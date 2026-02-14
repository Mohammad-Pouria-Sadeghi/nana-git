const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://pooria8099_db_user:wu4KjjQzADyMYNGQ@nasa-cluster.jmyvsru.mongodb.net/?appName=nasa-cluster";


mongoose.connection.on("connected", () => {
  console.log("🔥 MongoDB connected!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});


async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
