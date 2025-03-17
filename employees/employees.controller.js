// const express = require("express");
// const router = express.Router();
// const employeeService = require("./employee.service");

// // Employee Routes
// router.post("/add-employee", createEmployee);
// router.get("/", getAllEmployees);
// router.get("/:id", getEmployeeById);
// router.put("/:id", updateEmployee);
// router.delete("/:id", deleteEmployee);

// module.exports = router; // ✅ Ensure router is exported properly

// // Controller functions
// async function createEmployee(req, res) {
//     try {
//         const employee = await employeeService.createEmployee(req.body);
//         res.status(201).json(employee);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

// async function getAllEmployees(req, res) {
//     try {
//         const employees = await employeeService.getAllEmployees();
//         res.status(200).json(employees);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// async function getEmployeeById(req, res) {
//     try {
//         const employee = await employeeService.getEmployeeById(req.params.id);
//         if (!employee) {
//             return res.status(404).json({ message: 'Employee not found' });
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
//         res.status(200).json({ message: 'Employee deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }
