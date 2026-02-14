const http = require("http");
const app = require("./app");

const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const {
  loadLaunchData,
  removeWrongCustomerField,
} = require("./models/launches.model");

const PORT = 9000;

async function startServer() {
  await mongoConnect(); // 1. Connect to DB

  await removeWrongCustomerField(); // 2. Clean DB FIRST

  await loadPlanetsData(); // 3. Load planets
  await loadLaunchData(); // 4. Load launches (clean)

  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}


startServer();
