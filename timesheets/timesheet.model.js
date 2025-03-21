module.exports = (sequelize, DataTypes) => {
  const Timesheet = sequelize.define(
    'Timesheet',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      timeIn: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      timeOut: {
        type: DataTypes.TIME,
        allowNull: true, 
      },      
      totalHours: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      shift: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
      },
      action: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      upload_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'uploads',
          key: 'id', // CORRECTED: match sa Upload model
        },
      },
    },
    {
      timestamps: true,
      tableName: 'timesheets',
    }
  );

  return Timesheet;
};
