const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/", studentController.getAllstudents);
router.post("/", studentController.createstudent);
router.get("/:id", studentController.getstudentById);
router.put("/:id", studentController.updatestudent);
router.delete("/:id", studentController.deletestudent);

module.exports = router;
