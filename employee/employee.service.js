const db = require('../_helpers/db');

async function getEmployeeModel() {
    await db.ready; // Ensure database is initialized before using models
    return db.Employee;
}

// Create a new employee
async function createEmployee(employeeData) {
    try {
        const Employee = await getEmployeeModel();
        console.log("Creating Employee:", employeeData);

        if (!Employee) {
            throw new Error("Employee Model is not defined!");
        }

        const employee = Employee.build(employeeData);
        await employee.save();
        return employee;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Get all employees
async function getAllEmployees() {
    try {
        console.log("Retrieving all employees from DB...");
        const Employee = await getEmployeeModel();
        const employees = await Employee.findAll();
        console.log("Retrieved employees:", employees);
        return employees;
    } catch (error) {
        console.error("Error fetching employees from DB:", error.message);
        throw new Error(error.message);
    }
}

// Get an employee by ID
async function getEmployeeById(id) {
    try {
        const Employee = await getEmployeeModel();
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error("Employee not found");
        return employee;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Update an employee
async function updateEmployee(id, updateData) {
    try {
        const Employee = await getEmployeeModel();
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error("Employee not found");

        await employee.update(updateData);
        return employee;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Delete an employee
async function deleteEmployee(id) {
    try {
        const Employee = await getEmployeeModel();
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error("Employee not found");

        await employee.destroy();
        return { message: "Employee deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
