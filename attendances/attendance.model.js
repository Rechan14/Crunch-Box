module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    imageId: { type: DataTypes.STRING(255), allowNull: false }, // Image for Time In
    timeOutImageId: { type: DataTypes.STRING(255), allowNull: true }, // Image for Time Out
    shifts: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    timeIn: { type: DataTypes.DATE, allowNull: false },
    timeOut: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: "attendances",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  });

  return Attendance;
};
