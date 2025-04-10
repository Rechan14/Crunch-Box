module.exports = (sequelize, DataTypes) => {
    const Payslip = sequelize.define('Payslip', {
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        month: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        basicSalary: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        allowances: {
            type: DataTypes.FLOAT, 
            defaultValue: 0,
        },
        deductions: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        netSalary: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    });

    Payslip.associate = (models) => {
        Payslip.belongsTo(models.Account, { foreignKey: 'employeeId' });
    };

    return Payslip;
};
