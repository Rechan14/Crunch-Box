const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "ProfileUpload",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            account_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            profile_image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
            tableName: "profile_uploads",
        }
    );
};
