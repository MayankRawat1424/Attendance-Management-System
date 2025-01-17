const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRoutes = require("../routes/studentRoutes.js");
const attendanceRoutes = require("../routes/attendanceRoutes.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/erp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
