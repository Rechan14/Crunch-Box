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
    attendanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'attendances',
        key: 'id',
      },
    },
    details: {
      type: DataTypes.TEXT, // JSON string format
    },
    status: { 
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    date: {
      type: DataTypes.DATEONLY, // to track only the date
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Static method to log a shift change
  ActionLog.logShiftChange = async function (userId, timeIn, timeOut, AttendanceModel) {
    try {
      const dateOnly = timeIn.split("T")[0]; // get YYYY-MM-DD
  
      // Check if attendance exists for the given user and date
      let attendance = await AttendanceModel.findOne({
        where: { userId, date: dateOnly },
      });
  
      if (!attendance) {
        // Create attendance record if it doesn't exist
        attendance = await AttendanceModel.create({
          userId,
          date: dateOnly,
          timeIn: timeIn, // Set initial timeIn and timeOut if needed
          timeOut: timeOut,
        });
      }
  
      // Create action log with the attendanceId
      const actionLog = await ActionLog.create({
        userId,
        action: "Shift Change",
        attendanceId: attendance.id,  // Set the attendanceId to the existing or newly created attendance
        details: JSON.stringify({
          date: dateOnly,
          timeIn,
          timeOut,
        }),
        date: dateOnly,  // Explicitly set the `date` field to match the attendance date
      });
  
      console.log("Shift change logged:", actionLog.toJSON());
      return actionLog;
    } catch (error) {
      console.error("Error logging shift change:", error);
      throw error;
    }
  };
  
  // Static method to approve a shift change
  ActionLog.approveShiftChange = async function (id, AttendanceModel) {
    const t = await sequelize.transaction(); 
    try {
      // Fetch the action log and ensure it's pending
      const action = await ActionLog.findByPk(id, { transaction: t });
      if (!action || action.status !== "pending") {
        throw new Error("Pending action not found");
      }
  
      const parsedDetails = JSON.parse(action.details);
      const { timeIn, timeOut } = parsedDetails;
  
      if (!timeIn || !timeOut) {
        throw new Error("Missing time in/out in action details");
      }
  
      // Validate the time format (ensure they are valid Date objects)
      const timeInDate = new Date(timeIn);
      const timeOutDate = new Date(timeOut);
  
      if (isNaN(timeInDate) || isNaN(timeOutDate)) {
        throw new Error("Invalid time format for timeIn or timeOut");
      }
  
      // ✅ Fetch attendance by its actual ID
      const attendance = await AttendanceModel.findByPk(action.attendanceId, { transaction: t });
      
      if (!attendance) {
        throw new Error("Attendance record not found for the given ID");
      }
  
      // Double-check that the action log's attendance matches the one we are updating
      if (attendance.id !== action.attendanceId) {
        throw new Error("Mismatch between the action log's attendance and the selected record");
      }
  
      // Update the attendance record
      attendance.timeIn = timeIn;
      attendance.timeOut = timeOut;
      attendance.totalHours = parseFloat(((timeOutDate - timeInDate) / (1000 * 60 * 60)).toFixed(2));
  
      await attendance.save({ transaction: t });
  
      // Update the action log status to approved
      action.status = "approved";
      await action.save({ transaction: t });
  
      await t.commit();
      console.log("Shift change approved via attendanceId");
    } catch (err) {
      if (t) await t.rollback();
      console.error("Error approving shift change:", err);
      throw err;
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

  // Relationship
  ActionLog.associate = (models) => {
    ActionLog.belongsTo(models.Account, { foreignKey: "userId" });
  };

  return ActionLog;
};
 