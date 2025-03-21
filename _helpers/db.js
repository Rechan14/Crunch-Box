const config = require("../config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

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

        // Debugging: Check if Sequelize instance is valid
        console.log('Sequelize instance:', sequelize);

        // Load models with debugging
        try {
            console.log('Loading Upload model from:', require.resolve("../upload/upload.model"));
            db.Upload = require("../upload/upload.model")(sequelize, Sequelize);
            if (!db.Upload) {
                throw new Error('Upload model is undefined after import.');
            }
            console.log("Upload model loaded successfully.");
        } catch (error) {
            console.error("Error loading Upload model:", error);
            throw error;
        }

        db.Account = require("../accounts/account.model")(sequelize, Sequelize);
        db.RefreshToken = require("../accounts/refresh-token.model")(sequelize, Sequelize);
        db.Timesheet = require("../timesheets/timesheet.model")(sequelize, Sequelize);
        db.Employee = require("../employees/employee.model")(sequelize, Sequelize);
        db.ProfileUpload = require("../upload/profile-uploads.model")(sequelize, Sequelize);
        db.Attendance = require("../attendances/attendance.model")(sequelize, Sequelize);

        // Debugging: Log loaded models
        console.log("Loaded Models:", Object.keys(db));

        // Check if Upload model is loaded correctly
        if (!db.Upload) {
            console.error("Error: Upload model is undefined. Check your upload.model.js file.");
            throw new Error("Upload model is undefined.");
        } else {
            console.log("Upload model loaded successfully.");
        }

        // Define relationships after all models are loaded
        db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" });
        db.RefreshToken.belongsTo(db.Account);

        db.Account.hasOne(db.ProfileUpload, { onDelete: "CASCADE" });
        db.ProfileUpload.belongsTo(db.Account);

        db.Timesheet.belongsTo(db.Employee, { foreignKey: 'employeeId' });
        db.Employee.hasMany(db.Timesheet, { foreignKey: 'employeeId' });

        if (db.Upload) {
            db.Attendance.belongsTo(db.Upload, { foreignKey: 'uploadId' });
            db.Upload.hasMany(db.Attendance, { foreignKey: 'uploadId' });
        } else {
            console.error("Skipping Attendance-Upload relationship due to Upload model not being loaded.");
        }

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
