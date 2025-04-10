const db = require("_helpers/db");
const Payslip = db.Payslip;

async function createPayslip(payslipData) {
    return await Payslip.create(payslipData);
}

async function getPayslipsByEmployee(employeeId) {
    return await Payslip.findAll({
        where: { employeeId },
    });
}

async function getPayslipById(id) {
    return await Payslip.findByPk(id);
}

async function updatePayslip(id, payslipData) {
    const payslip = await Payslip.findByPk(id);
    if (payslip) {
        return await payslip.update(payslipData);
    }
    throw new Error("Payslip not found");
}

async function deletePayslip(id) {
    const payslip = await Payslip.findByPk(id);
    if (payslip) {
        await payslip.destroy();
        return true;
    }
    throw new Error("Payslip not found");
}

module.exports = {
    createPayslip,
    getPayslipsByEmployee,
    getPayslipById,
    updatePayslip,
    deletePayslip
};
