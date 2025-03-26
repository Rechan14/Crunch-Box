// const express = require("express");
// const router = express.Router();
// const employeeService = require("./employee.service"); 

// // Debugging log
// console.log("Employee Controller Loaded!");

// // Employee Routes
// router.post("/add-employee", createEmployee);
// router.get("/", getAllEmployees);
// router.get("/:id", getEmployeeById);
// router.put("/:id", updateEmployee);
// router.delete("/:id", deleteEmployee);

// module.exports = router;

// // Controller functions
// async function createEmployee(req, res) {
//     try {
//         console.log("Received Data:", req.body); // I-print ang data nga nadawat

//         if (!req.body.firstName || !req.body.lastName || !req.body.email) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         const employee = await employeeService.createEmployee(req.body);
//         res.status(201).json(employee);
//     } catch (error) {
//         console.error("Error adding employee:", error);
//         res.status(400).json({ message: error.message });
//     }
// }


// async function getAllEmployees(req, res) {
//     try {
//         console.log("Fetching employees...");
//         const employees = await employeeService.getAllEmployees();
//         console.log("Employees:", employees);
//         res.status(200).json(employees);
//     } catch (error) {
//         console.error("Error fetching employees:", error.message);
//         res.status(500).json({ message: error.message });
//     }
// }

// async function getEmployeeById(req, res) {
//     try {
//         const employee = await employeeService.getEmployeeById(req.params.id);
//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }
//         res.status(200).json(employee);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// async function updateEmployee(req, res) {
//     try {
//         const employee = await employeeService.updateEmployee(req.params.id, req.body);
//         res.status(200).json(employee);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

// async function deleteEmployee(req, res) {
//     try {
//         await employeeService.deleteEmployee(req.params.id);
//         res.status(200).json({ message: "Employee deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }