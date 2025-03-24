module.exports = (sequelize, DataTypes) => {
    const AttendanceLog = sequelize.define(
      "AttendanceLog",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        attendanceId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        fieldChanged: { type: DataTypes.STRING, allowNull: false },
        oldValue: { type: DataTypes.STRING, allowNull: true },
        newValue: { type: DataTypes.STRING, allowNull: true },
        changedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      { tableName: "attendance_logs", timestamps: false }
    );
  
    return AttendanceLog;
  };
  