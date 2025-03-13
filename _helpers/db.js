const config = require("../config.json"); // ✅ Ensure correct path
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

const db = {}; // ✅ Define db properly

async function initialize() {
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // ✅ Initialize Sequelize & Export It
    const sequelize = new Sequelize(database, user, password, {
        host,
        dialect: "mysql",
        logging: console.log, // Enables logging for debugging
    });

    // ✅ Export sequelize for models
    db.sequelize = sequelize; 

    // ✅ Load models correctly
    db.Account = require("../accounts/account.model")(sequelize);
    db.RefreshToken = require("../accounts/refresh-token.model")(sequelize);
    db.Employees = require("../employees/employee.model");
    db.Attendance = require("../attendance/attendance.model")(sequelize);

    // ✅ Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" });
    db.RefreshToken.belongsTo(db.Account);

    // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log("Database & tables initialized.");

}

initialize();

module.exports = db; // ✅ Now db contains sequelize
