const db = require("../_helpers/db");
const { Op } = require("sequelize");

module.exports = { recordAttendance, getAllAttendances, getAttendanceById };

async function recordAttendance(data) {
  try {
    const { userId, imageId, shifts, time } = data;
    if (!userId || !imageId || !shifts || !time) {
      throw new Error("Missing required fields: userId, imageId, shifts, or time.");
    }

    const timeObj = new Date(time);
    const dateOnly = timeObj.toISOString().split("T")[0];

    // Find the latest time-in record without a time-out
    let attendance = await db.Attendance.findOne({
      where: { userId, shifts, date: dateOnly, timeOut: null },
      order: [["timeIn", "DESC"]], // Get the latest time-in
    });

    if (!attendance) {
      // Create new Time In record
      attendance = await db.Attendance.create({
        userId,
        imageId,
        shifts,
        date: dateOnly,
        timeIn: timeObj,
      });
    } else {
      // Update existing Time Out
      attendance.timeOut = timeObj;
      attendance.timeOutImageId = imageId;
      
      // Calculate total hours
      attendance.totalHours = (timeObj - new Date(attendance.timeIn)) / (1000 * 60 * 60); // Convert ms to hours

      await attendance.save();
    }

    return attendance;
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw error;
  }
}


async function getAllAttendances(userId = null) {
  const whereCondition = userId ? { userId } : {}; // Filter if userId is provided
  return await db.Attendance.findAll({ where: whereCondition });
}


async function getAttendanceById(id) {
  return await db.Attendance.findByPk(id, { include: db.Upload });
}
