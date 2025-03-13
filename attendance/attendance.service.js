const db = require('../_helpers/db'); // Correct path to db.js
const Attendance = db.Attendance;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

// Get all attendance records
async function getAll() {
    return await Attendance.findAll();
}

// Get attendance record by ID
async function getById(id) {
    return await Attendance.findByPk(id);
}

// Create new attendance record
async function create(params) {
    // Ensure date & timeIn are set automatically
    const attendance = await Attendance.create({
        date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
        timeIn: new Date().toLocaleTimeString(), // Format: HH:MM:SS
        timeOut: null, // Initially null
        totalHours: "0", // Placeholder
        shifts: params.shifts || "Morning", // Default shift if not provided
        status: "In Progress", // Mark as "In Progress"
    });

    return attendance;
}

// Update attendance record
async function update(id, params) {
    const attendance = await Attendance.findByPk(id);
    if (!attendance) throw 'Attendance record not found';

    Object.assign(attendance, params);
    await attendance.save();
}

// Delete attendance record
async function _delete(id) {
    const attendance = await Attendance.findByPk(id);
    if (!attendance) throw 'Attendance record not found';

    await attendance.destroy();
}
