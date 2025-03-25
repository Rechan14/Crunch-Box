module.exports = (sequelize, DataTypes) => {
  const ActionLog = sequelize.define("ActionLog", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shiftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Static method to log a shift change
  ActionLog.logShiftChange = async function (shiftId, userId, timeIn, timeOut) {
    return await ActionLog.create({
      shiftId,
      userId,
      action: "Shift Change",
      details: `Requested shift change: Time In - ${timeIn}, Time Out - ${timeOut}`,
    });
  };

  // Static method to approve a shift change
  ActionLog.approveShiftChange = async function (id, ShiftModel) {
    const action = await ActionLog.findByPk(id);
    if (!action || action.status !== "pending") {
      throw new Error("Pending action not found");
    }

    const match = action.details.match(/Time In - (.*), Time Out - (.*)/);
    if (!match) throw new Error("Invalid action details format");

    const [, timeIn, timeOut] = match;

    const shift = await ShiftModel.findByPk(action.shiftId);
    if (!shift) throw new Error("Shift not found");

    shift.timeIn = timeIn;
    shift.timeOut = timeOut;
    await shift.save();

    action.status = "approved";
    await action.save();
  };

  return ActionLog;
};