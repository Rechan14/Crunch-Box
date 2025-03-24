const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('_helpers/db'); // assuming db.js is where your sequelize instance is set up

const ActionLog = sequelize.define('ActionLog', {
  shiftId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timeIn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeOut: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // default status is 'pending'
    allowNull: false,
  },
});

// Function to log changes
async function logShiftChange(shiftId, userId, timeIn, timeOut) {
    try {
      await ActionLog.create({
        shiftId,
        userId,
        timeIn,
        timeOut,
        status: 'pending', // assuming 'pending' is the default status
      });
    } catch (error) {
      console.error('Error creating action log:', error);
      throw new Error("Error logging shift change.");
    }
  }
  

// Function to approve shift change (update status to 'approved' and apply changes to the shift)
async function approveShiftChange(actionId) {
  const action = await ActionLog.findByPk(actionId);
  if (action && action.status === 'pending') {
    // Apply the changes to the shift
    await Shift.update(
      { timeIn: action.timeIn, timeOut: action.timeOut },
      { where: { id: action.shiftId } }
    );
    // Mark the action as approved
    action.status = 'approved';
    await action.save();
  }
}

module.exports = { ActionLog, logShiftChange, approveShiftChange };
