const axios = require("axios");
const launchesModel = require("./launches.mongo");
const planetsModel = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launch data...");

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        { path: "rocket", select: { name: 1 } },
        { path: "payloads", select: { customers: 1 } },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customerss = payloads.flatMap((payload) => payload.customers);
    console.log("customers", customerss);
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers: customerss,
    };

    // TODO: populate Launches collection with SpaceX data
    await saveLaunch(launch);
  }
}

async function removeWrongCustomerField() {
  const result = await launchesModel.updateMany(
    { customer: { $exists: true } },
    { $unset: { customer: "" } },
  );

  console.log("Removed wrong customer field:", result.modifiedCount);
}


async function loadLaunchData() {
  console.log("Downloading launch data...");

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    // await launchesModel.updateMany({}, { $unset: { customer: "" } });

    console.log("Launch data already loaded!");
  } else {
    await populateLaunches();
  }
}

/**
 * Check if a launch exists by flight number
 */

async function findLaunch(filter) {
  return await launchesModel.findOne(filter);
}

async function launchExists(launchId) {
  return findLaunch({ flightNumber: launchId });
}

/**
 * Get all launches (clean projection)
 */
async function getAllLaunches() {
  return launchesModel.find({}, { _id: 0, __v: 0 });
}

/**
 * Save or update a launch in DB
 */
async function saveLaunch(launch) {
  try {
    await launchesModel.findOneAndUpdate(
      { flightNumber: launch.flightNumber },
      launch,
      { upsert: true },
    );

    console.log(
      `Saving launch ${launch.flightNumber} - ${launch.mission} to the database...`,
    );
  } catch (error) {
    console.error("Could not save launch", error);
  }
}

/**
 * Get the latest flight number
 */
async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne().sort("-flightNumber");

  return latestLaunch?.flightNumber || DEFAULT_FLIGHT_NUMBER;
}

/**
 * Schedule a new launch
 */
async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const planet = await planetsModel.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    customers: ["WithLovePouriaEnterprise"],
    upcoming: true,
    success: true,
  };

  await saveLaunch(newLaunch);
}

/**
 * Abort a launch
 */
async function abortLaunch(launchId) {
  return launchesModel.findOneAndUpdate(
    { flightNumber: launchId },
    { upcoming: false, success: false },
    {
      new: true,
      projection: { _id: 0, __v: 0 },
    },
  );
}

module.exports = {
  getAllLaunches,
  abortLaunch,
  launchExists,
  loadLaunchData,
  scheduleNewLaunch,
  removeWrongCustomerField

};
