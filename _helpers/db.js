const config = require("../config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

const db = {}; // Define db properly

async function initialize() {
    try {
        const { host, port, user, password, database } = config.database;

        // Ensure the database exists
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();

        // Initialize Sequelize
        const sequelize = new Sequelize(database, user, password, {
            host,
            dialect: "mysql",
            logging: console.log, // Enables logging for debugging
        });

        // Attach Sequelize instance
        db.sequelize = sequelize;

        // Load models correctly
        db.Account = require("../accounts/account.model")(sequelize);
        db.RefreshToken = require("../accounts/refresh-token.model")(sequelize);
        db.Attendance = require("../attendance/attendance.model")(sequelize);

        //  Fix Upload model loading
        const UploadModel = require("../upload/upload.model"); // Import correctly
        db.Upload = UploadModel(sequelize); // Pass sequelize instance

        // Debugging: Print loaded models
        console.log(" Loaded Models:", Object.keys(db));

        if (!db.Upload) {
            throw new Error(" Upload model is NOT defined! Check db.js.");
        }
        const Upload = db.Upload; // Ensure Upload model is correctly referenced

        if (!Upload) {
            throw new Error("Upload model is not defined! Check db.js.");
        }
        // Define relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" });
        db.RefreshToken.belongsTo(db.Account);

        // Sync all models with the database
        await sequelize.sync({ alter: true });
        console.log("Database & tables initialized.");
    } catch (error) {
        console.error(" Database initialization error:", error);
    }
}

// Run the database initialization
initialize();

module.exports = db; // Export db object
