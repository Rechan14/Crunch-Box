module.exports = (sequelize, DataTypes) => {
  const ActionLog = sequelize.define("ActionLog", {
    userId: {
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
  ActionLog.logShiftChange = async function (userId, timeIn, timeOut) {
    try {
      console.log("Debug: Logging Shift Change - UserID:", userId);

      // Create the corresponding action log (no more Shift record)
      const actionLog = await ActionLog.create({
        userId,
        action: "Shift Change",
        details: `Requested shift change: Time In - ${timeIn}, Time Out - ${timeOut}`,
      });

      console.log("Shift change logged successfully:", actionLog.toJSON());
      return actionLog;
    } catch (error) {
      console.error("Error logging shift change:", error);
      throw error;
    }
  };

  // Static method to approve a shift change
  ActionLog.approveShiftChange = async function (id, AttendanceModel) {
    try {
      const action = await ActionLog.findByPk(id);
      console.log("Debug: ActionLog Record:", action ? action.toJSON() : "Not Found");

      if (!action || action.status !== "pending") {
        throw new Error("Pending action not found");
      }

      // Parse the new time-in and time-out values from details
      const match = action.details.match(/Time In - (.*), Time Out - (.*)/);
      if (!match) throw new Error("Invalid action details format");

      const [, timeIn, timeOut] = match;

      console.log("Debug: Extracted Time In:", timeIn);
      console.log("Debug: Extracted Time Out:", timeOut);

      // Find the corresponding attendance record for that user on the date of timeIn
      const dateOnly = timeIn.split("T")[0]; // extract YYYY-MM-DD
      const attendance = await AttendanceModel.findOne({
        where: {
          userId: action.userId,
          date: dateOnly,
        },
      });

      if (!attendance) {
        throw new Error("Attendance record not found for the given date");
      }

      // Update the attendance record
      attendance.timeIn = timeIn;
      attendance.timeOut = timeOut;
      await attendance.save();

      // Update the action log status
      action.status = "approved";
      await action.save();

      console.log("Attendance updated and action approved successfully!");
    } catch (error) {
      console.error("Error in approveShiftChange:", error);
      throw error;
    }
  };

  // Static method to reject a shift change
  ActionLog.rejectShiftChange = async function (id) {
    const action = await ActionLog.findByPk(id);
    if (!action || action.status !== "pending") {
      throw new Error("Pending action not found");
    }

    action.status = "rejected";
    await action.save();
  };

  // Define relationships
  ActionLog.associate = (models) => {
    ActionLog.belongsTo(models.Account, { foreignKey: "userId" });
  };

  return ActionLog;
};
