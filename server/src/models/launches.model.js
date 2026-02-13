const launchesModel = require("./launches.mongo");
const planetsModel = require("./planets.mongo");
const LATEST_FLIGHT_NUMBER = 100;

// const launches = new Map();

// let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
};
const launch2 = {
  flightNumber: 101,
  mission: "Kepler Exploration X101",
  rocket: "Explorer IS1 101",
  launchDate: new Date("December 27, 2050"),
  target: "Kepler-442 b 101",
  customer: ["ZTM", "NASA"],
  // upcoming: true,
};
// launches.set(launch.flightNumber, launch);
// launches.set(launch2.flightNumber, launch2);

function launchExists(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launchesModel.find({}, { _id: 0, __v: 0 });
  // return Array.from(launches.values());
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   Object.assign(launch, {
//     flightNumber: latestFlightNumber,
//     customers: ["WithLovePouriaEnterprise"],
//     upcoming: true,
//     success: true,
//   });
//   launches.set(launch.flightNumber, launch);
// }

async function scheduleNewLaunch(launch) {
  const latestFlightNumber = (await getLatestFlightNumber()) + 1;

  Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: ["WithLovePouriaEnterprise"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(launch);
}

const saveLaunch = async (launch) => {
  const planet = await planetsModel.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  try {
    await launchesModel.updateOne(
      { flightNumber: launch.flightNumber }, // filter
      launch, // update
      { upsert: true }, // options
      console.log(
        `Saving launch ${launch.flightNumber} - ${launch.mission} to the database...`,
      ),
    );
  } catch (error) {
    console.error(`Could not save launch `, error);
  }
};

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return LATEST_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

function abortLaunch(launchId) {
  const abortedLaunch = launches.get(launchId);
  abortedLaunch.upcoming = false;
  abortedLaunch.success = false;

  return abortedLaunch;
}

module.exports = {
  getAllLaunches,
  // addNewLaunch,
  abortLaunch,
  launchExists,
  scheduleNewLaunch,
};

saveLaunch(launch);

saveLaunch(launch2);
