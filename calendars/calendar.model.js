module.exports = (sequelize, DataTypes) => {
  const Calendar = sequelize.define('Calendar', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title is required"
        },
        notEmpty: {
          msg: "Title cannot be empty"
        }
      }
    },
    eventColor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Start Date must be a valid date"
        },
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "End Date must be a valid date"
        },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reminderEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    reminderMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: "Reminder minutes must be at least 1"
        }
      }
    },
    reminderNotificationTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    timestamps: true,
  });

  return Calendar;
}; 