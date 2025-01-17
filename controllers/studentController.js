const student = require("../models/studentModel");

exports.getAllstudents = async (req, res) => {
  try {
    const students = await student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err });
  }
};

exports.createstudent = async (req, res) => {
  try {
    const newstudent = new student(req.body);
    await newstudent.save();
    res.status(201).json(newstudent);
  } catch (err) {
    res.status(400).json({ message: "Error creating student", error: err });
  }
};

exports.getstudentById = async (req, res) => {
  try {
    const student = await student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student", error: err });
  }
};

exports.updatestudent = async (req, res) => {
  try {
    const updatedstudent = await student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedstudent)
      return res.status(404).json({ message: "student not found" });
    res.json(updatedstudent);
  } catch (err) {
    res.status(400).json({ message: "Error updating student", error: err });
  }
};

exports.deletestudent = async (req, res) => {
  try {
    const deletedstudent = await student.findByIdAndDelete(req.params.id);
    if (!deletedstudent)
      return res.status(404).json({ message: "student not found" });
    res.json({ message: "student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student", error: err });
  }
};
