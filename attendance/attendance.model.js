module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define("Attendance", {
      timeIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      shifts: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY, // only the YYYY-MM-DD part
        allowNull: false,
      },
    });
  
    return Attendance;
  };
  