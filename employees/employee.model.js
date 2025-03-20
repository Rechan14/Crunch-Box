const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Employee = sequelize.define("Employee", { 
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: { type: DataTypes.STRING, allowNull: false },
        middleName: { type: DataTypes.STRING },
        lastName: { type: DataTypes.STRING, allowNull: false },
        nickName: { type: DataTypes.STRING },
        suffix: { type: DataTypes.STRING },
        role: { type: DataTypes.STRING, allowNull: false },
        department: { type: DataTypes.STRING, allowNull: false },
        birthDate: { type: DataTypes.DATEONLY, allowNull: false },
        maritalStatus: { type: DataTypes.STRING },
        citizenship: { type: DataTypes.STRING },
        gender: { type: DataTypes.STRING, allowNull: false },
        email: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true,
            validate: { isEmail: true }
        },
        phone: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        postalCode: { type: DataTypes.STRING },
        province: { type: DataTypes.STRING },
        country: { type: DataTypes.STRING },
    });

    return Employee;  // Make sure to return the model
};