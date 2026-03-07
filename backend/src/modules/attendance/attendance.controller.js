const attendanceService = require('./attendance.service');
const { successResponse, errorResponse } = require('../../utils/response');

const attendanceController = {
    clockIn: async (req, res) => {
        try {
            const { id: employeeId, organizationId } = req.user;
            const attendance = await attendanceService.clockIn(employeeId, organizationId);
            return successResponse(res, attendance, 'Clocked in successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    clockOut: async (req, res) => {
        try {
            const { id: employeeId } = req.user;
            const attendance = await attendanceService.clockOut(employeeId);
            return successResponse(res, attendance, 'Clocked out successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    getTimesheets: async (req, res) => {
        try {
            const { organizationId } = req.user;
            const filters = req.query;
            const timesheets = await attendanceService.getTimesheets(organizationId, filters);
            return successResponse(res, timesheets, 'Timesheets fetched successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    addManualTime: async (req, res) => {
        try {
            const { organizationId } = req.user;
            const data = { ...req.body, organizationId };
            const manualTime = await attendanceService.addManualTime(data);
            return successResponse(res, manualTime, 'Manual time added successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    getManualTimes: async (req, res) => {
        try {
            const { organizationId } = req.user;
            const manualTimes = await attendanceService.getManualTimes(organizationId);
            return successResponse(res, manualTimes, 'Manual times fetched successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    getShifts: async (req, res) => {
        try {
            const { organizationId } = req.user;
            const { employeeId } = req.query;
            const shifts = await attendanceService.getShifts(organizationId, employeeId);
            return successResponse(res, shifts, 'Shifts fetched successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    },

    createShift: async (req, res) => {
        try {
            const { organizationId } = req.user;
            const data = { ...req.body, organizationId };
            const shift = await attendanceService.createShift(data);
            return successResponse(res, shift, 'Shift scheduled successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
};

module.exports = attendanceController;
