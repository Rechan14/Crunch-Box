const { DataTypes } = require("sequelize");
const { sequelize } = require("../_helpers/db"); //  Ensure sequelize is imported correctly

const Employee = sequelize.define("Employee", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING, allowNull: true },
    position: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: true },
    hireDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM("Active", "Inactive"), defaultValue: "Active" }
}, {
    timestamps: true,
    tableName: "employees"
});

module.exports = Employee; //  Export the model directly
