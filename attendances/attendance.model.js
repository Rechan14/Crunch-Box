// attendance.model.js
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    timeIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    timeOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shifts: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    uploadId: {
      type: DataTypes.INTEGER,
      references: {
        model: "uploads", // Ensure that "uploads" matches the table name of the Upload model
        key: "id",
      },
    },
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Upload, {
      foreignKey: 'uploadId',
      as: 'image',
    });
  };

  return Attendance;
};
