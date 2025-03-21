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

    // Use `db.Op` instead of `db.Sequelize.Op`
    let attendance = await db.Attendance.findOne({
      where: {
        imageId,
        shifts,
        createdAt: {
          [db.Op.startsWith]: date, // ✅ Fix: Use `db.Op` instead of `db.Sequelize.Op`
        },
      },
    });

    if (!attendance) {
      attendance = await db.Attendance.create({ imageId, shifts, timeIn: time });
    } else if (!attendance.timeOut) {
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
