import { useAuditLogStore } from '../store/auditLogStore';

/**
 * Utility to log administrative actions.
 * @param {string} userName - Name of the user performing the action.
 * @param {string} userRole - Role of the user.
 * @param {string} actionType - 'Create' | 'Update' | 'Delete'.
 * @param {string} objectType - The entity type (e.g. 'Employee', 'API Token').
 * @param {string} action - Description of the action.
 */
export function logAction(userName, userRole, actionType, objectType, action) {
    const { addLog } = useAuditLogStore.getState();
    
    addLog({
        userName,
        userRole,
        actionType,
        objectType,
        action
    });
}
