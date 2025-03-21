// timesheets.controller.js
const db = require("../_helpers/db");
const { Timesheet, Upload } = db;

const TimesheetController = {
  async createTimesheet(req, res) {
    try {
      const { shifts, image } = req.body;
      const today = new Date().toISOString().split("T")[0];

      // Ensure you're using image_name for matching
      const upload = await Upload.findOne({ where: { image_name: image } });  // Use image_name for better matching
      if (!upload) return res.status(404).json({ message: "Image not found" });

      const newTimesheet = await Timesheet.create({
        employeeId: 1, // Dynamically assign employeeId
        date: today,
        timeIn: new Date().toLocaleTimeString("en-US", { hour12: false }),
        timeOut: "00:00:00",
        totalHours: 0,
        shift: shifts,
        upload_id: upload.id,  // Ensure this matches with the Upload model's id field
      });

      res.status(201).json({ message: "Time in recorded", data: newTimesheet });
    } catch (error) {
      console.error("Failed to save attendance:", error);
      res.status(500).json({ message: "Failed to save attendance", error: error.message });
    }
  },

  async getAllTimesheets(req, res) {
    try {
      const timesheets = await Timesheet.findAll({ include: Upload });
      res.status(200).json(timesheets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTimesheetById(req, res) {
    try {
      const timesheet = await Timesheet.findByPk(req.params.id, { include: Upload });
      if (!timesheet) return res.status(404).json({ error: "Timesheet not found" });
      res.status(200).json(timesheet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateTimesheet(req, res) {
    try {
      const [updated] = await Timesheet.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: "Timesheet not found" });

      const updatedTimesheet = await Timesheet.findByPk(req.params.id);
      res.status(200).json(updatedTimesheet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteTimesheet(req, res) {
    try {
      const deleted = await Timesheet.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: "Timesheet not found" });
      res.status(200).json({ message: "Timesheet deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = TimesheetController;
