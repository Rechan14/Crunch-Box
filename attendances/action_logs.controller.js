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

    // Step 2: Check if there's no change in timeIn/timeOut
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

// Get action logs for a specific user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const { ActionLog } = await db;
    const logs = await ActionLog.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).send("Server error");
  }
});
 
// Approve shift change
router.put("/:id/approve", async (req, res) => {
  const { id: actionLogId } = req.params;
  console.log("Approving Shift Change for ID:", actionLogId);

  const { ActionLog, Attendance, sequelize } = await db;
  const transaction = await sequelize.transaction();

  try {
    const actionLog = await ActionLog.findByPk(actionLogId, { transaction });
    if (!actionLog) return res.status(404).send("Action log not found");

    const parsedDetails = JSON.parse(actionLog.details);
    const { timeIn, timeOut, date, userId } = parsedDetails;

    let attendance;

    if (actionLog.attendanceId) {
      // ✅ EDIT LOG (Attendance exists)
      attendance = await Attendance.findByPk(actionLog.attendanceId, { transaction });
      if (!attendance) throw new Error("Attendance record not found.");
    } else {
      // ➕ ADD LOG (No attendance yet)
      attendance = await Attendance.create({
        userId: actionLog.userId,
        date: date || new Date().toISOString().split("T")[0],
      }, { transaction });

      // Update log with new attendanceId
      actionLog.attendanceId = attendance.id;
    }

    // Format and validate times
    const formatTime = (timeStr) => {
      if (!timeStr) return null;
      const time = new Date(timeStr);
      if (isNaN(time.getTime())) return null;
      return time;
    };

    const timeInDate = formatTime(timeIn);
    const timeOutDate = formatTime(timeOut);

    // Apply time changes
    if (timeInDate) {
      attendance.timeIn = timeInDate;
    }
    if (timeOutDate) {
      attendance.timeOut = timeOutDate;
    }

    // ⏱️ Recalculate totalHours with proper AM/PM handling
    if (timeInDate && timeOutDate) {
      // Get hours for both times
      const timeInHours = timeInDate.getHours();
      const timeOutHours = timeOutDate.getHours();
      
      let totalHours;
      
      // If timeOut is earlier than timeIn, it means it's the next day
      if (timeOutHours < timeInHours) {
        // Calculate hours until midnight
        const hoursUntilMidnight = 24 - timeInHours;
        // Add hours from midnight to timeOut
        totalHours = hoursUntilMidnight + timeOutHours;
      } else {
        // Regular same-day calculation
        totalHours = timeOutHours - timeInHours;
      }

      // Set the total hours
      attendance.totalHours = parseFloat(totalHours.toFixed(2));
      
      console.log('Time Calculation Details:', {
        timeIn: timeInDate.toISOString(),
        timeOut: timeOutDate.toISOString(),
        timeInHours,
        timeOutHours,
        totalHours: attendance.totalHours
      });
    } else {
      attendance.totalHours = 0.0;
    }

    // Save attendance and approve log
    await attendance.save({ transaction });
    actionLog.status = "approved";
    await actionLog.save({ transaction });

    // Update attendance status to approved
    attendance.status = "approved";
    await attendance.save({ transaction });

    await transaction.commit();
    res.json({
      message: "Shift change approved and attendance updated successfully.",
      data: {
        attendance,
        actionLog
      }
    });

  } catch (error) {
    console.error("Approve Error:", error);
    await transaction.rollback();
    res.status(500).json({ 
      message: "Error approving shift change",
      error: error.message
    });
  }
});

// Reject shift change
router.put("/:id/reject", async (req, res) => {
  const { id } = req.params;
  const { ActionLog, Attendance, sequelize } = await db;
  const transaction = await sequelize.transaction();

  try {
    // Find the action log to reject
    const actionLog = await ActionLog.findByPk(id, { transaction });
    if (!actionLog) return res.status(404).send("Action log not found");

    // Find the associated attendance record
    const attendance = await Attendance.findByPk(actionLog.attendanceId, { transaction });
    if (attendance) {
      attendance.status = "rejected";
      await attendance.save({ transaction });
    }

    actionLog.status = "rejected";
    await actionLog.save({ transaction });

    await transaction.commit();
    res.send("Shift change rejected.");
  } catch (error) {
    console.error("Reject Error:", error);
    await transaction.rollback();
    res.status(500).send("Error rejecting shift change.");
  }
});
module.exports = router;