const db = require('../_helpers/db'); // Moved on top
const Timesheet = db.Timesheet; 
const Employee = db.Employee;

const TimesheetService = {
  // Create a new timesheet entry
  async createTimesheet(data) {
    return await Timesheet.create(data);
  },

  // Get all timesheets
  async getAllTimesheets() {
    return await Timesheet.findAll({ include: Employee });
  },

  // Get a timesheet by ID
  async getTimesheetById(id) {
    return await Timesheet.findByPk(id, { include: Employee });
  },

  // Update a timesheet
  async updateTimesheet(id, data) {
    const timesheet = await Timesheet.findByPk(id);
    if (!timesheet) return null;
    return await timesheet.update(data);
  },

  // Delete a timesheet
  async deleteTimesheet(id) {
    const timesheet = await Timesheet.findByPk(id);
    if (!timesheet) return null;
    await timesheet.destroy();
    return true;
  }
};

module.exports = TimesheetService;
