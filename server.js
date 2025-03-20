require("rootpath")();
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve uploaded profile images
app.use("/profile-uploads", express.static("profile-uploads"));

// API Routes
app.use("/accounts", require("./accounts/accounts.controller"));
app.use("/employee", require("./employees/employees.controller"));
app.use("/uploads", require("./upload/uploads.controller"));
app.use("/profile-uploads", require("./upload/profile-uploads.controller")); // Add profile uploads API
app.use("/api-docs", require("_helpers/swagger"));

// Global Error Handler
app.use(errorHandler);

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));