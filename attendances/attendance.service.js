const db = require("../_helpers/db");
const { Op } = require("sequelize");

module.exports = { recordAttendance, getAllAttendances, getAttendanceById };

async function recordAttendance(data) {
  try {
    const { imageId, shifts, time } = data;
    if (!imageId || !shifts || !time) {
      throw new Error("Missing required fields: imageId, shifts, or time.");
    }

    const timeObj = new Date(time);
    const dateOnly = timeObj.toISOString().split("T")[0];

    let attendance = await db.Attendance.findOne({
      where: { imageId: { [Op.like]: `%attendance-%` }, shifts, date: dateOnly }
    });

    if (!attendance) {
      // Time In
      attendance = await db.Attendance.create({
        imageId,
        shifts,
        date: dateOnly,
        timeIn: timeObj,
      });
    } else if (!attendance.timeOut) {
      // Time Out
      attendance.timeOut = timeObj;
      attendance.timeOutImageId = imageId; // Save second image
      await attendance.save();
    } else {
      throw new Error("Already timed in and out for today.");
    }

    return attendance;
  } catch (error) {
    console.error("Error recording attendance:", error);
    throw error;
  }
}

async function getAllAttendances() {
  return await db.Attendance.findAll({ include: db.Upload });
}

async function getAttendanceById(id) {
  return await db.Attendance.findByPk(id, { include: db.Upload });
}
