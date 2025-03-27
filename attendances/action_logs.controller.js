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
      const logs = await ActionLog.findAll({
        include: [
          {
            model: db.Account,
            attributes: ["firstName", "lastName"],
          },
        ],
      });

      console.log("API Response:", logs);
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
      const actionLog = await ActionLog.findByPk(id);
      if (!actionLog) {
        return res.status(404).send("Action log not found");
      }

      const shift = await Timesheet.findOne({ where: { id: actionLog.shiftId } });
      if (!shift) {
        return res.status(404).send("Shift not found");
      }

      shift.timeIn = actionLog.timeIn;
      shift.timeOut = actionLog.timeOut;
      await shift.save();

      actionLog.status = "approved";
      await actionLog.save();

      res.send("Shift change approved and shift updated.");
    } catch (error) {
      console.error("Approve Error:", error);
      res.status(500).send("Error approving shift change.");
    }
  });

  // Reject shift change
  router.put("/:id/reject", async (req, res) => {
    const { id } = req.params;
    try {
      const actionLog = await ActionLog.findByPk(id);
      if (!actionLog) {
        return res.status(404).send("Action log not found");
      }

      actionLog.status = "rejected";
      await actionLog.save();

      res.send("Shift change rejected.");
    } catch (error) {
      console.error("Reject Error:", error);
      res.status(500).send("Error rejecting shift change.");
    }
  });


});

module.exports = router;