const Attendance = require("../models/attendanceModel");
const Student = require("../models/studentModel");

exports.recordAttendance = async (req, res) => {
  try {
    const { student, subject, totalClasses, attendedClasses } = req.body;

    const newAttendance = new Attendance({
      student,
      subject,
      totalClasses,
      attendedClasses,
    });
    await newAttendance.save();

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance: newAttendance,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error recording attendance", error: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendanceRecords = await Attendance.find({
      student: studentId,
    }).populate("student");

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate("student");
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching all attendance records",
      error: error.message,
    });
  }
};

exports.getStudentAttendanceDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendanceRecords = await Attendance.find({
      student: studentId,
    }).populate("student");

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance details",
      error: error.message,
    });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status } = req.body;

    const attendanceRecord = await Attendance.findById(attendanceId).populate(
      "student"
    );
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    attendanceRecord.totalClasses += 1;
    if (status === "present") {
      attendanceRecord.attendedClasses += 1;
    }

    await attendanceRecord.save();

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance: attendanceRecord,
    });
  } catch (error) {
    console.error("Error in markAttendance:", error.message);
    res.status(500).json({ message: "Error updating attendance" });
  }
};
