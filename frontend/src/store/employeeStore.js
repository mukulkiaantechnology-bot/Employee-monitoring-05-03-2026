import { create } from 'zustand';
import employeeService from '../services/employeeService';
import toast from '../services/toastService';

export const useEmployeeStore = create((set, get) => ({
    employees: [],
    isLoading: false,
    error: null,

    fetchEmployees: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await employeeService.getEmployees();
            set({ employees: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    inviteEmployee: async (inviteData) => {
        set({ isLoading: true });
        try {
            const response = await employeeService.inviteEmployee(inviteData);
            const newEmployee = response.data;
            set((state) => ({
                employees: [...state.employees, {
                    ...newEmployee,
                    name: newEmployee.fullName,
                    status: 'invited',
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmployee.fullName)}&background=random`
                }],
                isLoading: false
            }));
            toast.success('Invitation sent successfully');
            return response;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateEmployee: async (id, data) => {
        try {
            const response = await employeeService.updateEmployee(id, data);
            const updatedEmployee = response.data;
            set((state) => ({
                employees: state.employees.map((emp) =>
                    emp.id === id ? { ...emp, ...updatedEmployee, name: updatedEmployee.fullName || emp.name } : emp
                )
            }));
            toast.success('Employee updated successfully');
            return response;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    removeEmployee: async (id) => {
        try {
            await employeeService.deleteEmployee(id);
            set((state) => ({
                employees: state.employees.filter((emp) => emp.id !== id)
            }));
            toast.success('Employee removed successfully');
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    }
}));
