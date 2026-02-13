// planets.model.js
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planets.mongo");

const habitablePlanets = [];

function isHabitable(planet) {
  const radius = parseFloat(planet.koi_prad);
  const insolation = parseFloat(planet.koi_insol);
  const disposition = planet.koi_disposition;

  return (
    disposition === "CONFIRMED" &&
    radius > 0.5 &&
    radius < 1.5 &&
    insolation > 0.36 &&
    insolation < 1.11
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv"),
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        }),
      )
      .on("data", async (row) => {
        if (isHabitable(row)) {
          // habitablePlanets.push(row);
          await savePlanet(row);
        }
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`Loaded ${countPlanetsFound} habitable planets`);
        resolve();
      })
      .on("error", reject);
  });
}

//  data access functions so it can abstract the way we store the data
async function getAllPlanets() {
  console.log("Getting all planets from the database...");

  const planetsList = await planets.find({}, { _id: 0, __v: 0 });

  // console.log(planetsList);

  return planetsList;
}


async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name }, // filter
      { keplerName: planet.kepler_name }, // update
      { upsert: true }, // options
    );
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};

// planets.model.js
// const fs = require("fs");
// const path = require("path");
// const { parse } = require("csv-parse");
// const planets = require("./planets.mongo");

// const habitablePlanets = [];

// function isHabitable(planet) {
//   const radius = parseFloat(planet.koi_prad);
//   const insolation = parseFloat(planet.koi_insol);
//   const disposition = planet.koi_disposition;

//   return (
//     disposition === "CONFIRMED" &&
//     radius > 0.5 &&
//     radius < 1.5 &&
//     insolation > 0.36 &&
//     insolation < 1.11
//   );
// }

// function loadPlanetsData() {
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(
//       path.join(__dirname, "..", "..", "data", "kepler_data.csv"),
//     )
//       .pipe(
//         parse({
//           comment: "#",
//           columns: true,
//         }),
//       )
//       .on("data", async (row) => {
//         if (isHabitable(row)) {
//           habitablePlanets.push(row);
//           // await savePlanet(row);
//         }
//       })
//       .on("end", async () => {
//         const countPlanetsFound = (await getAllPlanets()).length;
//         console.log(`Loaded ${countPlanetsFound} habitable planets`);
//         resolve();
//       })
//       .on("error", reject);
//   });
// }

// //  data access functions so it can abstract the way we store the data
// async function getAllPlanets() {
//   return habitablePlanets
//   //  console.log("Getting all planets from the database...");
//   //  console.log(await planets.find({}));
//   return await planets.find({});
// }

// async function savePlanet(planet) {
//   try {
//     await planets.updateOne(
//       { keplerName: planet.kepler_name }, // filter
//       { keplerName: planet.kepler_name }, // update
//       { upsert: true }, // options
//     );
//   } catch (error) {
//     console.error(`Could not save planet ${error}`);
//   }
// }

// module.exports = {
//   loadPlanetsData,
//   getAllPlanets,
// };
