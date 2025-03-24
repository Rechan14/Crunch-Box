module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Track which user the record belongs to
    // imageId: { type: DataTypes.STRING(255), allowNull: false }, // Image for Time In
    // timeOutImageId: { type: DataTypes.STRING(255), allowNull: true }, // Image for Time Out
    shifts: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    timeIn: { type: DataTypes.DATE, allowNull: false },
    timeOut: { type: DataTypes.DATE, allowNull: true },
    totalHours: { 
      type: DataTypes.FLOAT,
      allowNull: true,
      get() { // Calculate total hours dynamically
        if (this.getDataValue("timeOut")) {
          const timeIn = new Date(this.getDataValue("timeIn"));
          const timeOut = new Date(this.getDataValue("timeOut"));
          return (timeOut - timeIn) / (1000 * 60 * 60); // Convert ms to hours
        }
        return null;
      }
    }
  }, {
    tableName: "attendances",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  });

  return Attendance;
};
