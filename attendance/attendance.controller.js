const express = require("express");
const router = express.Router();
const db = require("../_helpers/db");
const { Timesheet, Upload } = db;


// POST /attendance
router.post("/attendance", async (req, res) => {
    try {
      const { shifts, image } = req.body;
      const today = new Date().toISOString().split("T")[0];
  
      // Find the upload record
      const upload = await Upload.findOne({ where: { image_name: image } });
      if (!upload) return res.status(404).json({ message: "Image not found" });
  
      const newTimesheet = await Timesheet.create({
        employeeId: 1, // hardcoded for now
        date: today,
        timeIn: new Date().toLocaleTimeString("en-US", { hour12: false }),
        timeOut: "00:00:00", // placeholder
        totalHours: 0,
        shift: shifts,
        upload_id: upload.id, // or upload.image_id, depende sa imong model
      });
  
      res.status(201).json({ message: "Time in recorded", data: newTimesheet });
    } catch (error) {
      console.error("Failed to save attendance:", error);
      res.status(500).json({ message: "Failed to save attendance", error });
    }
  });
  
  
module.exports = router;
