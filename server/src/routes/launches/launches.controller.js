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
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
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

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);

  // laucnh exists
  if (!launchExists(launchId)) {
    return res.status(404).json({
      error: "launch not found",
    });
  }
  // abort laucnh

  const aborted = abortLaunch(launchId);
  return res.status(200).json(aborted);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
