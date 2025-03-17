const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "Upload",
        {
            image_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            image_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true, // Prevent duplicate images
            },
            image: {
                type: DataTypes.STRING, // Store path instead of base64
                allowNull: false,
            },
            created: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
            tableName: "uploads", // Ensure table name consistency
        }
    );
};
