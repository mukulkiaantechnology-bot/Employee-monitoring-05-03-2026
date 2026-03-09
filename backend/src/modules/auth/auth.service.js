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
            fullName: user.employee?.fullName || user.email.split('@')[0],
            name: user.employee?.fullName || user.email.split('@')[0], 
            avatar: user.employee?.avatar || null,
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

    // Flatten data if employee exists
    if (user.employee) {
        user.fullName = user.employee.fullName;
        user.name = user.employee.fullName; // For frontend compatibility
        user.avatar = user.employee.avatar;
        
        if (user.employee.organization) {
            user.organization = user.employee.organization;
            user.organizationId = user.employee.organizationId;
        }
        user.teamId = user.employee.teamId;
    } else {
        // Provide fallbacks for users without employee record (like seeded admins)
        user.fullName = user.email.split('@')[0];
        user.name = user.fullName;
        user.avatar = null;
    }

    return user;
};

/**
 * Update user/employee profile
 */
const updateProfile = async (userId, data) => {
    const { name, email, avatar } = data;

    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id: userId },
            include: { employee: true }
        });

        if (!user) throw new Error('User not found');

        // Update user email if changed
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: { email: email || user.email }
        });

        // Update employee name, email, and avatar
        if (user.employeeId) {
            await tx.employee.update({
                where: { id: user.employeeId },
                data: {
                    fullName: name || user.employee.fullName,
                    email: email || user.email,
                    avatar: avatar || user.employee.avatar
                }
            });
        } else if (name || avatar) {
            // Create employee if missing (for users created without employee profile like seeded admins)
            const org = await tx.organization.findFirst() || { id: 'default-org-id' };
            const employee = await tx.employee.create({
                data: {
                    fullName: name || user.email.split('@')[0],
                    email: user.email,
                    role: user.role,
                    organizationId: org.id,
                    avatar: avatar
                }
            });
            await tx.user.update({
                where: { id: userId },
                data: { employeeId: employee.id }
            });
        }

        return updatedUser;
    });
};

/**
 * Change user password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error('Invalid current password');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
};

/**
 * Forgot password (Mock)
 */
const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return; // Silent return for security

    console.log(`[ForgotPassword] Mock reset link generated for ${email}`);
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword
};
