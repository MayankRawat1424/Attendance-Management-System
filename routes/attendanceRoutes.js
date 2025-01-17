const express = require("express");
const router = express.Router();
const {
  recordAttendance,
  getAttendance,
  getAllAttendance,
  markAttendance,
} = require("../controllers/attendanceController");

// Route to record attendance
router.post("/", recordAttendance);

// Route to get attendance records for a specific student
router.get("/:studentId", getAttendance);

// (Optional) Route to get attendance for all students
router.get("/", getAllAttendance);

router.put("/mark/:attendanceId", markAttendance);

module.exports = router;
