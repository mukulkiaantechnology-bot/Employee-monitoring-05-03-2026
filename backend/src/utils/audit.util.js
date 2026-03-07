const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Capture a system or security event in the audit log.
 * 
 * @param {Object} params
 * @param {string} params.organizationId - ID of the organization
 * @param {string} params.userId - ID of the employee/user who performed the action
 * @param {string} params.action - Description of the action (e.g., "User Login")
 * @param {string} params.status - Result of the action (e.g., "Success", "Denied", "Warning")
 * @param {string} [params.ipAddress] - IP address of the user
 * @param {Object} [params.metadata] - Additional JSON data related to the event
 */
const createAuditLog = async ({ organizationId, userId, action, status, ipAddress, metadata }) => {
    try {
        await prisma.auditLog.create({
            data: {
                organizationId,
                userId,
                action,
                status,
                ipAddress: ipAddress || null,
                metadata: metadata || {}
            }
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // We don't want to throw here as audit logging shouldn't break the main flow
    }
};

module.exports = {
    createAuditLog
};
