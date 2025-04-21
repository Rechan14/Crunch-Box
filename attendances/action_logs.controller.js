const express = require("express");
const router = express.Router();
const db = require("_helpers/db");

// Helper to safely parse date strings
function parseTimeSafely(input) {
  if (!input) return null;
  const parsed = new Date(input);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Log shift change with daily limit
router.post("/", async (req, res) => {
  const { userId, timeIn, timeOut } = req.body;

  try {
    const { ActionLog, Attendance } = await db;

    const today = new Date().toISOString().split("T")[0];
    const MAX_REQUESTS_PER_DAY = parseInt(process.env.MAX_REQUESTS_PER_DAY) || 1;

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

    // Step 1: Fetch the attendance record for today
    const attendance = await Attendance.findOne({
      where: {
        userId,
        date: today,
      },
    });

    // If no attendance record, proceed to create a new ActionLog
    if (!attendance) {
      return res.status(404).json({ message: "No attendance record found for today." });
    }

    const incomingTimeIn = timeIn ? new Date(timeIn).toISOString() : null;
    const incomingTimeOut = timeOut ? new Date(timeOut).toISOString() : null;

    const currentTimeIn = attendance.timeIn ? new Date(attendance.timeIn).toISOString() : null;
    const currentTimeOut = attendance.timeOut ? new Date(attendance.timeOut).toISOString() : null;

    // Step 2: Check if there’s no change in timeIn/timeOut
    const noChange = incomingTimeIn === currentTimeIn && incomingTimeOut === currentTimeOut;

    if (noChange) {
      return res.status(400).json({
        message: "No changes detected. Your shift details are already up to date.",
      });
    }

    // Step 3: Proceed to log shift change
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

// Approve shift change
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

    // ✅ Recalculate totalHours
    const timeInDate = parseTimeSafely(attendance.timeIn);
    const timeOutDate = parseTimeSafely(attendance.timeOut);

    if (timeInDate && timeOutDate && timeOutDate > timeInDate) {
      const diffInMs = timeOutDate - timeInDate;
      const calculatedHours = parseFloat((diffInMs / (1000 * 60 * 60)).toFixed(2));
      attendance.totalHours = calculatedHours;
      console.log(`Recalculated totalHours: ${calculatedHours} (from ${timeInDate.toISOString()} to ${timeOutDate.toISOString()})`);
    } else {
      console.warn("⚠️ Skipping totalHours calculation. Invalid or incomplete timeIn/timeOut.", {
        timeIn: attendance.timeIn,
        timeOut: attendance.timeOut,
      });
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