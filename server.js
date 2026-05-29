const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Student = require("./models/student");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/students", async (req, res) => {
  try {
    const { name, rollNo, email, course, semester } = req.body;

    if (!name || !rollNo || !email || !course || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await Student.findOne({ rollNo });

    if (existingStudent) {
      return res.status(409).json({ message: "Roll number already exists" });
    }

    const student = new Student({ name, rollNo, email, course, semester });
    await student.save();

    res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding student" });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const { name, rollNo, email, course, semester } = req.body;

    if (!name || !rollNo || !email || !course || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Student.findByIdAndUpdate(
      req.params.id,
      { name, rollNo, email, course, semester },
      { new: true }
    );

    res.json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});