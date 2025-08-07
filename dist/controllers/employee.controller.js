"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Employee_schema_1 = require("../schemas/Employee.schema");
const EmployeeService_1 = __importDefault(require("../services/EmployeeService"));
class EmployeeController {
    async create(req, res) {
        const parsed = Employee_schema_1.employeeSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.format();
            return res.status(400).json({ errors });
        }
        try {
            const employee = await EmployeeService_1.default.create(parsed.data);
            return res.status(201).json({
                message: 'Funcionário cadastrado com sucesso.',
                user: employee,
            });
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async getAll(req, res) {
        try {
            const employees = await EmployeeService_1.default.getAll();
            return res.status(200).json({
                message: 'Lista de funcionários.',
                data: employees,
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.default = new EmployeeController();
//# sourceMappingURL=employee.controller.js.map