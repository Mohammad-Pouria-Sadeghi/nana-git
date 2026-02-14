const express = require("express");
const apiRouter = express.Router();

const planetsRouter = require("./planets/planets.route");
const launchesRouter = require("./launches/launches.router");

apiRouter.use("/planets", planetsRouter);
apiRouter.use("/launches", launchesRouter);

module.exports = apiRouter;