const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    roll: String,
    department: String,
    email: String
});

module.exports = mongoose.model("Student", studentSchema);