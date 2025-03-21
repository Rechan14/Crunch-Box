module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imageId: { type: DataTypes.INTEGER, allowNull: false }, // Links to Uploads table
    shifts: { type: DataTypes.STRING, allowNull: false },
    timeIn: { type: DataTypes.DATE, allowNull: false },
    timeOut: { type: DataTypes.DATE, allowNull: true }, // Initially null
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { tableName: "attendances", timestamps: false });

  return Attendance;
};
