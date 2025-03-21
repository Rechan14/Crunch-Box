const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const db = require("../_helpers/db");  // Make sure this is the correct path
const { Attendance, Upload } = db;  // Ensure 'Upload' is correctly destructured from db

// POST request to record attendance
router.post("/", async (req, res) => {
  try {
    console.log("Received attendance payload:", req.body);

    const { shifts, image, timeIn } = req.body;

    // Check if the required fields are present
    if (!shifts || !timeIn) {
      return res.status(400).json({ message: "Missing required fields: shifts or timeIn." });
    }

    // Format the date for the 'date' field (YYYY-MM-DD)
    const today = new Date(timeIn).toISOString().split("T")[0];

    let uploadedImage = null;

    // Step 1: Upload image if present
    if (image) {
      console.log("Uploading image...");

      const imageName = `image_${Date.now()}.png`; // Generate a unique image name
      const uploadPath = path.join(__dirname, "../uploads", imageName);  // 'uploads' folder

      // Decode base64 string and write to file
      const base64Data = image.replace(/^data:image\/png;base64,/, '');  // Remove base64 prefix
      try {
        // Write the image to the uploads folder
        fs.writeFileSync(uploadPath, base64Data, 'base64');

        // Save image reference to the database
        uploadedImage = await Upload.create({
          image_name: imageName,
          image: uploadPath,  // Save the image path
        });

        console.log("Image saved to DB:", uploadedImage.toJSON());
      } catch (imageError) {
        console.error("Failed to upload image:", imageError);
        return res.status(500).json({ message: "Failed to upload image", error: imageError.message });
      }
    }

    // Step 2: Create the attendance record (without image)
    const newAttendanceData = {
      timeIn: new Date(timeIn),
      timeOut: null,
      shifts,
      date: today,
      // We don't link the image to attendance in this step
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
