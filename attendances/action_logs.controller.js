const express = require("express");
const router = express.Router();
const db = require("_helpers/db");

// Log shift change
router.post("/", async (req, res) => {
  const { userId, timeIn, timeOut } = req.body;
  try {
    const { ActionLog } = await db;
    const log = await ActionLog.logShiftChange(userId, timeIn, timeOut);
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
    const { ActionLog, Account } = await db;
    const logs = await ActionLog.findAll({
      include: [{ model: Account, attributes: ["firstName", "lastName"] }],
    });
    res.json(logs);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).send("Error fetching action logs.");
  }
});

// Approve shift change (now using Attendance instead of Shift)
router.put("/:id/approve", async (req, res) => {
  const { id: actionLogId } = req.params;
  console.log("Approving Shift Change for ID:", actionLogId);

  try {
    const { ActionLog, Attendance } = await db;
    await ActionLog.approveShiftChange(actionLogId, Attendance);
    res.send("Shift change approved and attendance updated.");
  } catch (error) {
    console.error("Approve Error:", error);
    res.status(500).send("Error approving shift change.");
  }
});

// Reject shift change
router.put("/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    const { ActionLog } = await db;

    const actionLog = await ActionLog.findByPk(id);
    if (!actionLog) return res.status(404).send("Action log not found");

    actionLog.status = "rejected";
    await actionLog.save();

    res.send("Shift change rejected.");
  } catch (error) {
    console.error("Reject Error:", error);
    res.status(500).send("Error rejecting shift change.");
  }
});

module.exports = router;
