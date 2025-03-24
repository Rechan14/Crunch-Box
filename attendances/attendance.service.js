const db = require("../_helpers/db");

module.exports = { recordAttendance, getAllAttendances, getAttendanceById };

// Handle both Time In & Time Out in one function
async function recordAttendance(data) {
  try {
    const { imageId, shifts, time } = data;
    if (!imageId || !shifts || !time) {
      throw new Error("Missing required fields: imageId, shifts, or time.");
    }

    const date = new Date(time).toISOString().split("T")[0];

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    // Optional: Debug log
    console.log("Checking attendance for:", imageId, "Shift:", shifts);
    console.log("Date range:", startOfDay, "to", endOfDay);

    let attendance = await db.Attendance.findOne({
      where: {
        imageId,
        shifts,
        createdAt: {
          [db.Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (!attendance) {
      // First time: Time In
      attendance = await db.Attendance.create({
        imageId,
        shifts,
        timeIn: time,
      });
    } else if (!attendance.timeOut) {
      // Second time: Time Out
      attendance.timeOut = time;
      await attendance.save();
    } else {
      throw new Error("Time In & Time Out already recorded for today.");
    }

    return attendance;
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw error;
  }
}

// Get all attendance records
async function getAllAttendances() {
  return await db.Attendance.findAll({ include: db.Upload });
}

// Get attendance by ID
async function getAttendanceById(id) {
  return await db.Attendance.findByPk(id, { include: db.Upload });
}
