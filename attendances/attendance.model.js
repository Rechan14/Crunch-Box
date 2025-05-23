
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Track which user the record belongs to
    imageId: { type: DataTypes.STRING(255), allowNull: false }, // Image for Time In
    timeOutImageId: { type: DataTypes.STRING(255), allowNull: true }, // Image for Time Out
    shifts: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    timeIn: { type: DataTypes.DATE, allowNull: false },
    timeOut: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      get() {
        const timeIn = this.getDataValue("timeIn");
        const timeOut = this.getDataValue("timeOut");
    
        // Ensure both timeIn and timeOut exist
        if (timeIn && timeOut) {
          const timeInDate = new Date(timeIn);
          const timeOutDate = new Date(timeOut);
    
          // If timeOut is before timeIn, it means it's the next day
          if (timeOutDate < timeInDate) {
            // Add 24 hours to timeOut
            timeOutDate.setDate(timeOutDate.getDate() + 1);
          }
    
          const diffInMs = timeOutDate.getTime() - timeInDate.getTime();
          return diffInMs / (1000 * 60 * 60);
        }
        return null; // Return null if timeOut doesn't exist
      }, 
    }     
  }, {
    tableName: "attendances",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  });

  return Attendance;
};