const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        date: { type: DataTypes.STRING, allowNull: false },
        timeIn: { type: DataTypes.STRING, allowNull: false },
        timeOut: { type: DataTypes.STRING, allowNull: false },
        totalHours: { type: DataTypes.STRING, allowNull: false },
        shifts: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        isVerified: {
            type: DataTypes.VIRTUAL,
            get() { return !!(this.verified || this.passwordReset); }
        }
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false, 
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }        
    };

    return sequelize.define("attendance", attributes, options);
}