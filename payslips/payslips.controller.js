const payslipService = require('./payslip.service');
const { authorize } = require('_middleware/authorize');
const { validateRequest } = require('_middleware/validate-request');
const Joi = require('joi');

module.exports = {
    create,
    getAllByEmployee,
    getById,
    update,
    delete: _delete
};

function create(req, res, next) {
    const schema = Joi.object({
        employeeId: Joi.number().required(),
        month: Joi.string().required(),
        year: Joi.number().required(),
        basicSalary: Joi.number().required(),
        allowances: Joi.number().optional(),
        deductions: Joi.number().optional(),
        netSalary: Joi.number().required()
    });

    validateRequest(req, next, schema);

    payslipService.createPayslip(req.body)
        .then(payslip => res.json(payslip))
        .catch(next);
}

function getAllByEmployee(req, res, next) {
    const employeeId = req.user.id;
    payslipService.getPayslipsByEmployee(employeeId)
        .then(payslips => res.json(payslips))
        .catch(next);
}

function getById(req, res, next) {
    const { id } = req.params;

    payslipService.getPayslipById(id)
        .then(payslip => res.json(payslip))
        .catch(next);
}

function update(req, res, next) {
    const { id } = req.params;

    const schema = Joi.object({
        basicSalary: Joi.number().optional(),
        allowances: Joi.number().optional(),
        deductions: Joi.number().optional(),
        netSalary: Joi.number().optional()
    });

    validateRequest(req, next, schema);

    payslipService.updatePayslip(id, req.body)
        .then(payslip => res.json(payslip))
        .catch(next);
}

function _delete(req, res, next) {
    const { id } = req.params;

    payslipService.deletePayslip(id)
        .then(() => res.json({ message: 'Payslip deleted successfully' }))
        .catch(next);
}
