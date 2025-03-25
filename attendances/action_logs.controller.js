const express = require("express");
const router = express.Router();
const db = require("_helpers/db");

db.ready.then(() => {
  const { ActionLog, Timesheet } = db;

  // Log shift change
  router.post("/", async (req, res) => {
    const { shiftId, userId, timeIn, timeOut } = req.body;
    try {
      const log = await ActionLog.logShiftChange(shiftId, userId, timeIn, timeOut);
      res.status(201).json({
        message: "Shift change logged successfully.",
        data: log,
      });
    } catch (error) {
      console.error("Log Error:", error);
      res.status(500).json({ message: "Error logging shift change." });
    }
  });

  // View all action logs
  router.get("/", async (req, res) => {
    try {
      const logs = await ActionLog.findAll();
      res.json(logs);
    } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).send("Error fetching action logs.");
    }
  });

  // Approve shift change
  router.put("/:id/approve", async (req, res) => {
    const { id } = req.params;
    try {
      await ActionLog.approveShiftChange(id, Timesheet);
      res.send("Shift change approved successfully.");
    } catch (error) {
      console.error("Approve Error:", error);
      res.status(500).send("Error approving shift change.");
    }
  });
});

module.exports = router;
