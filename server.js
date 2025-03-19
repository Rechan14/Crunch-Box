require("rootpath")();
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");
// const EmailModule = require('./email-senders/email-sender.module');

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

// app.use(bodyParser.json()); // Ensure body is parsed properly
// EmailModule(app); // Register the Email Module

// API Routes
app.use("/accounts", require("./accounts/accounts.controller"));
app.use("/employee", require("./employees/employees.controller"));
app.use("/uploads", require("./upload/uploads.controller"));
app.use("/api-docs", require("_helpers/swagger"));

// Authentication Route
app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  return res.json({ token: "fake-jwt-token", user: { email } });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
