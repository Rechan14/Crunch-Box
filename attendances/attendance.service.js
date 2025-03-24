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
        totalHours: 0.00, // Ensure default value
      });
    } else {
      // Ensure timeIn exists before calculating totalHours
      if (attendance.timeIn) {
        const timeInDate = new Date(attendance.timeIn);
        const timeOutDate = new Date(timeObj);
    
        // Calculate total hours and format it to 2 decimal places
        const hoursWorked = (timeOutDate - timeInDate) / (1000 * 60 * 60);
        attendance.totalHours = parseFloat(hoursWorked.toFixed(2));
      } else {
        attendance.totalHours = 0.00; // Fallback if something goes wrong
      }
    
      // Update timeOut and save the record
      attendance.timeOut = timeObj;
      attendance.timeOutImageId = imageId;
    
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
