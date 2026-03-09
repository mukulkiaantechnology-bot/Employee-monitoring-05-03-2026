const prisma = require('../../config/db');

class EmployeesService {
    async getEmployees(organizationId, filter = {}) {
        return await prisma.employee.findMany({
            where: { 
                organizationId,
                role: 'EMPLOYEE', // EXCLUDE ADMIN AND MANAGER
                ...filter
            },
            include: {
                team: {
                    select: { name: true }
                }
            }
        });
    }

    async getEmployeeById(id) {
        return await prisma.employee.findUnique({
            where: { id },
            include: { 
                team: true,
                organization: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
    }

    async inviteEmployee(data) {
        // Create employee with INVITED status
        return await prisma.employee.create({
            data: {
                ...data,
                status: 'INVITED'
            }
        });
    }

    async updateEmployee(id, data) {
        return await prisma.employee.update({
            where: { id },
            data
        });
    }

    async deleteEmployee(id) {
        // Usually deactivate instead of delete
        return await prisma.employee.update({
            where: { id },
            data: { status: 'DEACTIVATED' }
        });
    }
}

module.exports = new EmployeesService();
