"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = __importDefault(require("../infra/supabase/connect"));
const AuthService_1 = __importDefault(require("./AuthService"));
class EmployeeService {
    async create({ name, email, password, position }) {
        const { userId } = await AuthService_1.default.signUp({ username: name, email, password });
        if (!userId) {
            throw new Error('Failed to create user');
        }
        const { data, error } = await connect_1.default
            .from('employees')
            .insert({
            user_id: userId,
            name,
            position,
            created_at: new Date().toISOString(),
        })
            .select(`
      id,
      name,
      position,
      created_at,
      user:users(id, email, display_name)
    `)
            .single();
        if (error) {
            await connect_1.default.auth.admin.deleteUser(userId);
            throw new Error(`Failed to create employee: ${error.message}`);
        }
        return {
            id: String(data.id),
            name: String(data.name),
            position: String(data.position),
            created_at: String(data.created_at),
            user: data.user.map((u) => ({
                id: String(u.id),
                email: String(u.email),
                display_name: String(u.display_name),
            })),
        };
    }
    async getAll() {
        const { data, error } = await connect_1.default
            .from('employees')
            .select(`
      id,
      name,
      position,
      created_at,
      user:users(id, email, display_name)
    `)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`Failed to list employees: ${error.message}`);
        }
        return data.map((item) => ({
            id: String(item.id),
            name: String(item.name),
            position: String(item.position),
            created_at: String(item.created_at),
            user: item.user.map((u) => ({
                id: String(u.id),
                email: String(u.email),
                display_name: String(u.display_name),
            })),
        }));
    }
}
exports.default = new EmployeeService();
//# sourceMappingURL=EmployeeService.js.map