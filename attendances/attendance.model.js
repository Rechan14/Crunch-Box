module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    // Change from INTEGER to STRING
    imageId: { type: DataTypes.STRING(255), allowNull: false }, // Holds filename

    shifts: { type: DataTypes.STRING, allowNull: false },
    timeIn: { type: DataTypes.DATE, allowNull: false },
    timeOut: { type: DataTypes.DATE, allowNull: true }, // Initially null
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: "attendances",
    timestamps: false,
  });

  return Attendance;
};
