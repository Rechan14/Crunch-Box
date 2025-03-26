// const bcrypt = require('bcrypt'); // Import bcrypt
// const db = require('../_helpers/db');

// async function getEmployeeModel() {
//     await db.ready; // Ensure database is initialized before using models
//     return db.Employee;
// }

// async function getAccountModel() {  // Get Account model
//     await db.ready;
//     return db.Account;  
// }

// // Create Employee and Account
// async function createEmployee(employeeData) {
//     try {
//         const Employee = await getEmployeeModel();
//         const Account = await getAccountModel();

//         // Check if Account exists with same email
//         const existingAccount = await Account.findOne({ where: { email: employeeData.email } });
//         let account;

//         if (!existingAccount) {
//             const hashedPassword = await bcrypt.hash("default123", 10); // 10 = salt rounds
            
//             account = await Account.create({
//                 title: employeeData.title || "Mr.",   // Set a default title if missing
//                 firstName: employeeData.firstName,
//                 lastName: employeeData.lastName,
//                 country: employeeData.country,
//                 city: employeeData.city,
//                 postalCode: employeeData.postalCode,
//                 email: employeeData.email,
//                 passwordHash: hashedPassword,  // Store hashed password
//                 role: employeeData.role || "User",  // Default to 'User' if not provided
//                 isVerified: true,  // Auto-verify
//                 termsAccepted: true // Auto-accept terms
//             });
//         } else {
//             account = existingAccount;
//         }

//         // Create Employee with linked Account
//         const employee = await Employee.create({
//             ...employeeData,
//             accountId: account.id, // Associate employee with the account
//         });

//         return employee;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }


// // Get all employees
// async function getAllEmployees() {
//     try {
//         console.log("Retrieving all employees from DB...");
//         const Employee = await getEmployeeModel();
//         const employees = await Employee.findAll();
//         console.log("Retrieved employees:", employees);
//         return employees;
//     } catch (error) {
//         console.error("Error fetching employees from DB:", error.message);
//         throw new Error(error.message);
//     }
// }

// // Get an employee by ID
// async function getEmployeeById(id) {
//     try {
//         const Employee = await getEmployeeModel();
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
//         const Employee = await getEmployeeModel();
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
//         const Employee = await getEmployeeModel();
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