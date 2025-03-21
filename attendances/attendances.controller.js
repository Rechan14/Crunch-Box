const express = require("express");
const router = express.Router();
const db = require("../_helpers/db");  // Ensure this is the correct path
const { Attendance } = db;  // Only require Attendance model

// POST request to record attendance
router.post("/", async (req, res) => {
  try {
    console.log("Received attendance payload:", req.body);

    const { shifts, timeIn } = req.body;

    // Check if the required fields are present
    if (!shifts || !timeIn) {
      return res.status(400).json({ message: "Missing required fields: shifts or timeIn." });
    }

    // Format the date for the 'date' field (YYYY-MM-DD)
    const today = new Date(timeIn).toISOString().split("T")[0];

    // Step 1: Create the attendance record without handling image upload
    const newAttendanceData = {
      timeIn: new Date(timeIn),
      timeOut: null,
      shifts,
      date: today,
    };

    try {
      const newAttendance = await Attendance.create(newAttendanceData);
      console.log("Attendance saved to DB:", newAttendance.toJSON());

      // Return success response
      return res.status(201).json({ message: "Time in recorded", data: newAttendance });
    } catch (attendanceError) {
      console.error("Failed to save attendance:", attendanceError);
      return res.status(500).json({ message: "Failed to save attendance", error: attendanceError.message });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Unexpected error occurred", error: error.message });
  }
});

module.exports = router;
