import supabase from '../infra/supabase/connect';
import { Employee, EmployeeDTO } from '../models/Employee';
import AuthService from './AuthService';

class EmployeeService {
async create({ name, email, password, position }: Employee): Promise<EmployeeDTO> {
  const { userId } = await AuthService.signUp({ username: name, email, password });

  if (!userId) {
    throw new Error('Failed to create user');
  }

  const { data, error } = await supabase
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
    await supabase.auth.admin.deleteUser(userId);
    throw new Error(`Failed to create employee: ${error.message}`);
  }

  return {
    id: String(data.id),
    name: String(data.name),
    position: String(data.position),
    created_at: String(data.created_at),
    user: data.user.map((u: any) => ({
      id: String(u.id),
      email: String(u.email),
      display_name: String(u.display_name),
    })),
  };
}

async getAll(): Promise<EmployeeDTO[]> {
  const { data, error } = await supabase
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

  return data.map((item: any) => ({
    id: String(item.id),
    name: String(item.name),
    position: String(item.position),
    created_at: String(item.created_at),
    user: item.user.map((u: any) => ({
      id: String(u.id),
      email: String(u.email),
      display_name: String(u.display_name),
    })),
  }));
}

}

export default new EmployeeService();