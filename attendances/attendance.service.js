const db = require("_helpers/db");

module.exports = {
  create,
};

async function create(data) {
  // Add date based on timeIn
  data.date = new Date().toISOString().split("T")[0];
  return await db.Attendance.create(data);
}