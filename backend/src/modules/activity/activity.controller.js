const activityService = require('./activity.service');
const { successResponse, errorResponse } = require('../../utils/response');

const activityController = {
    createActivityLog: async (req, res) => {
        try {
            const { employeeId, activityType, duration, productivity, timestamp, appWebsite } = req.body;
            const organizationId = req.user.organizationId; // From auth middleware

            const log = await activityService.createActivityLog({
                employeeId,
                organizationId,
                activityType,
                duration,
                productivity,
                timestamp,
                appWebsite
            });

            return successResponse(res, log, 'Activity log created successfully');
        } catch (error) {
            console.error('Error creating activity log:', error);
            return errorResponse(res, error.message);
        }
    },

    getEmployeeActivity: async (req, res) => {
        try {
            const { employeeId } = req.params;
            const { startDate, endDate } = req.query;

            const logs = await activityService.getEmployeeActivity(employeeId, startDate, endDate);
            return successResponse(res, logs, 'Employee activity fetched successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    getTeamActivity: async (req, res) => {
        try {
            const { teamId } = req.params;
            const { startDate, endDate } = req.query;

            const logs = await activityService.getTeamActivity(teamId, startDate, endDate);
            return successResponse(res, logs, 'Team activity fetched successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    getOrganizationActivity: async (req, res) => {
        try {
            const organizationId = req.user.organizationId;
            const { startDate, endDate } = req.query;

            const logs = await activityService.getOrganizationActivity(organizationId, startDate, endDate);
            return successResponse(res, logs, 'Organization activity fetched successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    getOrganizationSummary: async (req, res) => {
        try {
            const organizationId = req.user.organizationId;
            const { startDate, endDate } = req.query;

            if (!organizationId) {
                console.warn('[ActivityController] Missing organizationId in request user');
                // Return empty summary instead of 500
                return successResponse(res, [], 'No organization activity found');
            }

            const summary = await activityService.getOrganizationSummary(organizationId, startDate, endDate);
            return successResponse(res, summary, 'Organization summary fetched successfully');
        } catch (error) {
            console.error('[ActivityController] Summary Error:', error);
            return errorResponse(res, error.message);
        }
    },
};

module.exports = activityController;
