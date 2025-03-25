const config = require("../config.json");
const mysql = require("mysql2/promise");
const { Sequelize, DataTypes, Op } = require("sequelize"); // Include Op here

const db = {}; // Initialize db object

async function initialize() {
    try {
        const { host, port, user, password, database } = config.database;

        // Ensure database exists
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();

        // Initialize Sequelize
        const sequelize = new Sequelize(database, user, password, {
            host,
            dialect: "mysql",
            logging: console.log, // Debugging logs
        });

        // Test DB Connection
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        // Attach Sequelize instance to db object
        db.sequelize = sequelize;
        db.Op = Op; //Export Op for use in services

        // Load models
        console.log('Loading Upload model from:', require.resolve("../upload/upload.model"));
        db.Upload = require("../upload/upload.model")(sequelize, DataTypes);
        if (!db.Upload) {
            throw new Error('Upload model is undefined after import.');
        }
        console.log("Upload model loaded successfully.");

        db.Account = require("../accounts/account.model")(sequelize, DataTypes);
        db.RefreshToken = require("../accounts/refresh-token.model")(sequelize, DataTypes);
        db.Timesheet = require("../timesheets/timesheet.model")(sequelize, DataTypes);
        db.Employee = require("../employees/employee.model")(sequelize, DataTypes);
        db.ProfileUpload = require("../upload/profile-uploads.model")(sequelize, DataTypes);
        db.Attendance = require("../attendances/attendance.model")(sequelize, DataTypes);
        db.AttendanceLog = require("../attendances/attendance_log.model")(sequelize, DataTypes);
        db.ActionLog = require("../attendances/action_log.model")(sequelize, DataTypes);
        

        console.log("Loaded Models:", Object.keys(db));

        // Define relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" });
        db.RefreshToken.belongsTo(db.Account);

        db.Account.hasOne(db.ProfileUpload, { onDelete: "CASCADE" });
        db.ProfileUpload.belongsTo(db.Account);

        db.Timesheet.belongsTo(db.Employee, { foreignKey: 'employeeId' });
        db.Employee.hasMany(db.Timesheet, { foreignKey: 'employeeId' });

        db.Attendance.belongsTo(db.Upload, { foreignKey: 'uploadId' });
        db.Upload.hasMany(db.Attendance, { foreignKey: 'uploadId' });

        // Sync models with database
        await sequelize.sync({ alter: true });
        console.log("Database & tables synchronized.");
    } catch (error) {
        console.error("Database initialization error:", error);
        throw error;
    }
}

// Create a `ready` Promise that resolves when initialization is complete
db.ready = initialize();

module.exports = db;
