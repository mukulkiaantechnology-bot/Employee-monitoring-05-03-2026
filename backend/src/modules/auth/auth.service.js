const bcrypt = require('bcrypt');
const prisma = require('../../config/db');
const { generateToken } = require('../../utils/jwt');

/**
 * Register a new user and employee
 */
const register = async (userData) => {
    const { name, email, password, role, organizationId, teamId, hourlyRate } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Employee and User in a transaction
    return await prisma.$transaction(async (tx) => {
        // 1. Create Employee
        const employee = await tx.employee.create({
            data: {
                fullName: name, // Fixed: fullName instead of name
                email,
                role,
                organizationId,
                teamId,
                hourlyRate,
            },
        });

        // 2. Create User linked to Employee
        const user = await tx.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                employeeId: employee.id,
            },
        });

        // Generate Token
        const token = generateToken({ 
            userId: user.id, 
            role: user.role, 
            employeeId: employee.id, // Added: include employeeId in token
            organizationId: employee.organizationId 
        });
        return { token, user: { id: user.id, email: user.email, role: user.role, employeeId: employee.id, organizationId: employee.organizationId, teamId: employee.teamId } };
    });
};

/**
 * Login user
 */
const login = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { employee: true },
    });

    if (!user) {
        // Log failed login (no user found)
        // Note: In a real app, you might want to log this without organizationId if not found
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        // Log failed login (wrong password)
        const { createAuditLog } = require('../../utils/audit.util');
        await createAuditLog({
            organizationId: user.employee?.organizationId,
            userId: user.employeeId,
            action: 'User Login',
            status: 'Denied',
            metadata: { reason: 'Invalid password' }
        });
        throw new Error('Invalid email or password');
    }

    const token = generateToken({
        userId: user.id,
        role: user.role,
        employeeId: user.employeeId, // Added: include employeeId in token
        organizationId: user.employee?.organizationId
    });

    // Log successful login
    const { createAuditLog } = require('../../utils/audit.util');
    await createAuditLog({
        organizationId: user.employee?.organizationId,
        userId: user.employeeId,
        action: 'User Login',
        status: 'Success'
    });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            organizationId: user.employee?.organizationId,
            teamId: user.employee?.teamId,
        },
    };
};

/**
 * Get current user profile
 */
const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
            employeeId: true,
            createdAt: true,
            employee: {
                include: {
                    organization: true,
                    team: true,
                },
            },
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Flatten organization data if employee exists
    if (user.employee && user.employee.organization) {
        user.organization = user.employee.organization;
        user.organizationId = user.employee.organizationId;
        user.teamId = user.employee.teamId;
    }

    return user;
};

module.exports = {
    register,
    login,
    getMe,
};
