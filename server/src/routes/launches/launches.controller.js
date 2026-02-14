const {
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunch,
  launchExists,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  // ۱. بررسی فیلدهای ضروری
  const requiredFields = ["mission", "rocket", "launchDate", "target"];

  const missingFields = requiredFields.filter((field) => !launch[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required launch properties",
      missing: missingFields,
    });
  }

  // ۲. تبدیل تاریخ (اسم property درست است: launchDate)
  launch.launchDate = new Date(launch.launchDate);

  // ۳. بررسی معتبر بودن تاریخ
  if (isNaN(launch.launchDate.valueOf())) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  // ۴. اضافه کردن به مدل
  await scheduleNewLaunch(launch);

  // ۵. بازگشت پاسخ
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  // validate id
  if (isNaN(launchId)) {
    return res.status(400).json({ error: "invalid launch id" });
  }

  // check existence
  const existsLaunch = await launchExists(launchId);
  if (!existsLaunch) {
    return res.status(404).json({ error: "launch not found" });
  }

  // abort
  const aborted = await abortLaunch(launchId);
  if (!aborted) {
    return res.status(400).json({ error: "launch not aborted" });
  }

  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
