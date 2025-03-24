const express = require("express");
const router = express.Router();
const attendanceService = require("../attendances/attendance.service");

// Handle Time In & Time Out (Ensures user-specific records)
router.post("/", async (req, res) => {
  try {
    console.log("Received attendance payload:", req.body);

    if (!req.body.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const attendance = await attendanceService.recordAttendance(req.body);
    res.status(201).json({ message: "Attendance recorded successfully", data: attendance });

  } catch (error) {
    console.error("Failed to record attendance:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all attendances (Optional: Add user filter)
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query; // Allow filtering by user ID
    const attendances = await attendanceService.getAllAttendances(userId);
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await attendanceService.getAttendanceById(id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
