const express = require("express");
const router = express.Router();
const attendanceService = require("./attendance.service");

// Routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;

// Get all attendance records
async function getAll(req, res, next) {
    try {
        const records = await attendanceService.getAll();
        res.json(records);
    } catch (err) {
        next(err);
    }
}

// Get attendance record by ID
async function getById(req, res, next) {
    try {
        const record = await attendanceService.getById(req.params.id);
        if (!record) return res.status(404).json({ message: "Attendance record not found" });
        res.json(record);
    } catch (err) {
        next(err);
    }
}

// Create a new attendance record
async function create(req, res, next) {
    try {
        const record = await attendanceService.create(req.body);
        res.status(201).json(record);
    } catch (err) {
        next(err);
    }
}

// Update an attendance record
async function update(req, res, next) {
    try {
        await attendanceService.update(req.params.id, req.body);
        res.json({ message: "Attendance record updated successfully" });
    } catch (err) {
        next(err);
    }
}

// Delete an attendance record
async function _delete(req, res, next) {
    try {
        await attendanceService.delete(req.params.id);
        res.json({ message: "Attendance record deleted successfully" });
    } catch (err) {
        next(err);
    }
}
