// const db = require("../_helpers/db");
// const Employee = db.Employee;

// // Create a new employee
// async function createEmployee(employeeData) {
//     try {
//         const employee = await Employee.create(employeeData);
//         return employee;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// // Get all employees
// async function getAllEmployees() {
//     try {
//         const employees = await Employee.findAll();
//         return employees;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// // Get an employee by ID
// async function getEmployeeById(id) {
//     try {
//         const employee = await Employee.findByPk(id);
//         if (!employee) throw new Error("Employee not found");
//         return employee;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// // Update an employee
// async function updateEmployee(id, updateData) {
//     try {
//         const employee = await Employee.findByPk(id);
//         if (!employee) throw new Error("Employee not found");
        
//         await employee.update(updateData);
//         return employee;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// // Delete an employee
// async function deleteEmployee(id) {
//     try {
//         const employee = await Employee.findByPk(id);
//         if (!employee) throw new Error("Employee not found");
        
//         await employee.destroy();
//         return { message: "Employee deleted successfully" };
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

// module.exports = {
//     createEmployee,
//     getAllEmployees,
//     getEmployeeById,
//     updateEmployee,
//     deleteEmployee
// };
