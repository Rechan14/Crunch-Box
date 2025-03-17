require("rootpath")();
require("dotenv").config(); // Load .env variables
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("_middleware/error-handler");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//  Fixed CORS Configuration (Only One Setup)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend requests
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);


// API Routes
app.use("/accounts", require("./accounts/accounts.controller"));

// Swagger Docs Route
app.use("/api-docs", require("_helpers/swagger"));

// Global Error Handler
app.use(errorHandler);

// Employee Route
// app.use("/employee", require("./employees/employees.controller")); //  Ensure this line is after middleware setup

// Attendance Route
// app.use("/attendance", require("./attendance/attendance.controller"));

// Upload Route
app.use("/uploads", require("./uploads/uploads.controller"));


// LogIn Route
app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Dummy response (replace with actual authentication logic)
  return res.json({ token: "fake-jwt-token", user: { email } });
});

// const uploadRoutes = require("./uploads/upload"); 
// app.use(uploadRoutes);

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(` Server listening on port ${port}`));