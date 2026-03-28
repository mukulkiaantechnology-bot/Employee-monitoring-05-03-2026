const trackingService = require('./tracking.service');
const { successResponse, errorResponse } = require('../../utils/response');
const { getOrganizationId } = require('../../utils/orgId');

class TrackingController {
    async getProfiles(req, res) {
        try {
            const organizationId = await getOrganizationId(req);
            const profiles = await trackingService.getProfiles(organizationId);
            return successResponse(res, profiles, 'Tracking profiles fetched successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async createProfile(req, res) {
        try {
            const organizationId = await getOrganizationId(req);
            const profile = await trackingService.createProfile(organizationId, req.body);
            return successResponse(res, profile, 'Tracking profile created successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async updateProfile(req, res) {
        try {
            const { id } = req.params;
            const organizationId = await getOrganizationId(req);
            const profile = await trackingService.updateProfile(id, organizationId, req.body);
            return successResponse(res, profile, 'Tracking profile updated successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async deleteProfile(req, res) {
        try {
            const { id } = req.params;
            const organizationId = await getOrganizationId(req);
            await trackingService.deleteProfile(id, organizationId);
            return successResponse(res, null, 'Tracking profile deleted successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getAdvancedSettings(req, res) {
        try {
            const organizationId = await getOrganizationId(req);
            const settings = await trackingService.getAdvancedSettings(organizationId);
            return successResponse(res, settings, 'Advanced settings fetched successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async updateAdvancedSettings(req, res) {
        try {
            const organizationId = await getOrganizationId(req);
            const settings = await trackingService.updateAdvancedSettings(organizationId, req.body);
            return successResponse(res, settings, 'Advanced settings updated successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
}

module.exports = new TrackingController();
