const express = require("express");
const router = express.Router();
const {
  recordAttendance,
  getAttendance,
  getAllAttendance,
  markAttendance,
} = require("../controllers/attendanceController");

router.post("/", recordAttendance);

router.get("/:studentId", getAttendance);

router.get("/", getAllAttendance);

router.put("/mark/:attendanceId", markAttendance);

module.exports = router;
