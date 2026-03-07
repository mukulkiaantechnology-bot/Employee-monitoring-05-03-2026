const tasksService = require('./tasks.service');
const { successResponse, errorResponse } = require('../../utils/response');
const { getOrganizationId } = require('../../utils/orgId');

class TasksController {
    async createTask(req, res) {
        try {
            const organizationId = await getOrganizationId(req);
            const task = await tasksService.createTask(req.body, organizationId);
            return successResponse(res, task, 'Task created successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getTasks(req, res) {
        try {
            const organizationId = await getOrganizationId(req);
            const tasks = await tasksService.getTasks(organizationId);
            return successResponse(res, tasks, 'Tasks retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async getBoardTasks(req, res) {
        try {
            const organizationId = await getOrganizationId(req);
            const board = await tasksService.getBoardTasks(organizationId);
            return successResponse(res, board, 'Board tasks retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const task = await tasksService.updateTask(id, req.body);
            return successResponse(res, task, 'Task updated successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async updateTaskStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const task = await tasksService.updateTaskStatus(id, status);
            return successResponse(res, task, 'Task status updated successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }

    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            await tasksService.deleteTask(id);
            return successResponse(res, null, 'Task deleted successfully');
        } catch (error) {
            return errorResponse(res, error.message);
        }
    }
}

module.exports = new TasksController();
