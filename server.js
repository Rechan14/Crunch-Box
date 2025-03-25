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
app.use('/api/timesheets', require('./timesheets/timesheets.routes')); 
app.use("/uploads", require("./upload/uploads.controller"));
app.use("/profile-uploads", require("./upload/profile-uploads.controller"));
app.use("/api-docs", require("_helpers/swagger"));
app.use("/attendances", require("./attendances/attendances.controller"));
app.use("/action-logs", require("./attendances/action_logs.controller"));

// app.post('/action-logs', async (req, res) => {
//   const { shiftId, userId, timeIn, timeOut } = req.body;
//   try {
//     // Log the shift change
//     await logShiftChange(shiftId, userId, timeIn, timeOut);
//     res.status(201).json({
//       message: "Shift change logged successfully.",
//       data: { shiftId, userId, timeIn, timeOut },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error logging shift change." });
//   }
// });

// Endpoint to get all action logs
app.get('/action-logs', async (req, res) => {
  try {
    const actionLogs = await ActionLog.findAll();
    res.json(actionLogs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching action logs.");
  }
});

// Endpoint to approve a shift change
app.put('/action-logs/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    // Approve the shift change
    await approveShiftChange(id);
    res.send("Shift change approved successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error approving shift change.");
  }
});



// Global Error Handler
app.use(errorHandler);

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));