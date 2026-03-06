const prisma = require('../../config/db');

class TeamsService {
    async getTeams(organizationId, role, userId) {
        // If Admin, see all teams in org
        // If Manager, see all teams in org (or could be filtered by managed teams)
        // For now, simplify based on user requirement: "Manager: See team employees only."
        // We'll filter the data return in controller but service provides raw data.
        return await prisma.team.findMany({
            where: { organizationId },
            include: {
                _count: {
                    select: { employees: true }
                },
                employees: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        });
    }

    async getTeamById(id) {
        return await prisma.team.findUnique({
            where: { id },
            include: {
                employees: true
            }
        });
    }

    async createTeam(data) {
        return await prisma.team.create({
            data
        });
    }

    async updateTeam(id, data) {
        return await prisma.team.update({
            where: { id },
            data
        });
    }

    async deleteTeam(id) {
        return await prisma.team.delete({
            where: { id }
        });
    }
}

module.exports = new TeamsService();
