const express = require("express");
const router = express.Router();
const db = require("_helpers/db");
// const { sequelize, ActionLog, Attendance } = require('_helpers/db');

// Log shift change with daily limit
router.post("/", async (req, res) => {
  const { userId, timeIn, timeOut } = req.body;

  try {
    const { ActionLog, Attendance } = await db;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const MAX_REQUESTS_PER_DAY = parseInt(process.env.MAX_REQUESTS_PER_DAY) || 1;

    // ✅ Check if user already submitted a log today
    const existingLogs = await ActionLog.count({
      where: {
        userId,
        date: today,
      },
    });

    if (existingLogs >= MAX_REQUESTS_PER_DAY) {
      return res.status(400).json({
        message: "You already submitted a shift change request today.",
      });
    }

    // ✅ Proceed to log shift change
    const log = await ActionLog.logShiftChange(userId, timeIn, timeOut, Attendance);
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

// Approve shift change (using attendanceId directly)
router.put("/:id/approve", async (req, res) => {
  const { id: actionLogId } = req.params;
  console.log("Approving Shift Change for ID:", actionLogId);

  const { ActionLog, Attendance, sequelize } = await db;

  if (!sequelize) {
    console.error("Sequelize instance not found.");
    return res.status(500).send("Internal Server Error: Sequelize instance missing.");
  }

  const transaction = await sequelize.transaction();

  try {
    const actionLog = await ActionLog.findByPk(actionLogId, { transaction });

    if (!actionLog) {
      console.error("Action log not found for ID:", actionLogId);
      return res.status(404).send("Action log not found");
    }

    // ✅ Make sure actionLog has a valid attendanceId
    if (!actionLog.attendanceId) {
      throw new Error("Missing attendanceId in action log.");
    }

    const attendance = await Attendance.findByPk(actionLog.attendanceId, { transaction });

    if (!attendance) {
      console.error("Attendance not found for ID:", actionLog.attendanceId);
      throw new Error("Attendance record not found.");
    }

    const parsedDetails = JSON.parse(actionLog.details);
    console.log("Parsed Details:", parsedDetails);

    // Update only the fields provided in the log details (timeIn, timeOut, etc.)
    attendance.timeIn = parsedDetails.timeIn ?? attendance.timeIn;
    attendance.timeOut = parsedDetails.timeOut ?? attendance.timeOut;

    // Optional: Recalculate totalHours (if you're not using the getter)
    // You can also add logic here if needed
    const timeInDate = new Date(attendance.timeIn);
    const timeOutDate = new Date(attendance.timeOut);

    if (!isNaN(timeInDate) && !isNaN(timeOutDate) && timeOutDate > timeInDate) {
      const diffInMs = timeOutDate - timeInDate;
      attendance.totalHours = parseFloat((diffInMs / (1000 * 60 * 60)).toFixed(2));
    }

    await attendance.save({ transaction });

    // Mark actionLog as approved
    actionLog.status = "approved";
    await actionLog.save({ transaction });

    await transaction.commit();
    console.log("✅ Shift change approved and attendance updated.");

    res.send("Shift change approved and attendance updated.");
  } catch (error) {
    console.error("Approve Error:", error);
    await transaction.rollback();
    res.status(500).send("Error approving shift change.");
  }
});
  
// Reject shift change
router.put("/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    const { ActionLog } = await db;

    // Find the action log to reject
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