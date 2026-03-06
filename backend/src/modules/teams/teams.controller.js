const prisma = require('../../config/db');
const teamsService = require('./teams.service');
const { createTeamSchema, updateTeamSchema } = require('./teams.validation');

const getTeams = async (req, res, next) => {
    try {
        let orgId = req.user.organizationId;

        // Fallback: If not in JWT, fetch from employee record
        if (!orgId) {
            const employee = await prisma.employee.findFirst({
                where: { id: req.user.employeeId }
            });
            orgId = employee?.organizationId;
        }

        if (!orgId) {
            console.error(`[TeamsController] No organizationId found for user: ${req.user.userId}`);
            return res.status(400).json({ success: false, message: "Organization ID is required" });
        }

        const teams = await teamsService.getTeams(orgId, req.user.role, req.user.userId);

        // Map to industry/insightful format
        const formattedTeams = teams.map(team => ({
            id: team.id,
            name: team.name,
            description: team.description,
            color: team.color,
            memberCount: team._count.employees,
            onlineCount: team.employees.filter(e => e.status === 'ACTIVE').length, // Simplified online check
            productivity: 85, // Placeholder for metric calculation
            organizationId: team.organizationId
        }));

        res.status(200).json({
            success: true,
            data: formattedTeams
        });
    } catch (error) {
        next(error);
    }
};

const createTeam = async (req, res, next) => {
    try {
        const validatedData = createTeamSchema.parse(req.body);
        const team = await teamsService.createTeam(validatedData);
        res.status(201).json({
            success: true,
            message: "Team created successfully",
            data: team
        });
    } catch (error) {
        next(error);
    }
};

const updateTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const validatedData = updateTeamSchema.parse(req.body);
        const team = await teamsService.updateTeam(id, validatedData);
        res.status(200).json({
            success: true,
            message: "Team updated successfully",
            data: team
        });
    } catch (error) {
        next(error);
    }
};

const deleteTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        await teamsService.deleteTeam(id);
        res.status(200).json({
            success: true,
            message: "Team deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam
};
