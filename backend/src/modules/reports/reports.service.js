const prisma = require('../../config/db');
const { getOrganizationId } = require('../../utils/orgId');

/**
 * Work Type Report: Distribution of productivity categories across app usage.
 */
const getWorkTypeReport = async (organizationId, startDate, endDate) => {
    const logs = await prisma.appUsageLog.groupBy({
        by: ['productivity'],
        _sum: { duration: true },
        where: {
            organizationId,
            timestamp: { gte: startDate, lte: endDate }
        }
    });

    return logs.map(log => ({
        type: log.productivity,
        duration: log._sum.duration || 0
    }));
};

/**
 * Apps & Websites Report: Detailed usage per app.
 */
const getAppsReport = async (organizationId, startDate, endDate) => {
    return prisma.appUsageLog.groupBy({
        by: ['appName', 'category', 'productivity'],
        _sum: { duration: true },
        where: {
            organizationId,
            timestamp: { gte: startDate, lte: endDate }
        },
        orderBy: {
            _sum: { duration: 'desc' }
        },
        take: 20
    });
};

/**
 * Schedule Adherence Report: Compare Attendance with Shifts.
 */
const getAdherenceReport = async (organizationId, startDate, endDate) => {
    const employees = await prisma.employee.findMany({
        where: { organizationId },
        include: {
            attendance: {
                where: { date: { gte: startDate, lte: endDate } }
            }
        }
    });

    return employees.map(emp => {
        const totalAttendance = emp.attendance.length;
        const lateAttendance = emp.attendance.filter(a => a.late).length;
        const adherenceScore = totalAttendance > 0 
            ? Math.round(((totalAttendance - lateAttendance) / totalAttendance) * 100) 
            : 0;

        return {
            employee: emp.fullName,
            status: adherenceScore >= 90 ? 'Excellent' : adherenceScore >= 80 ? 'Good' : 'Needs Improvement',
            adherence: adherenceScore
        };
    });
};

/**
 * Location Insights Report: Work hours and employee counts per location.
 */
const getLocationInsights = async (organizationId, startDate, endDate) => {
    const employees = await prisma.employee.findMany({
        where: { organizationId },
        include: {
            attendance: {
                where: { date: { gte: startDate, lte: endDate } }
            },
            locationLogs: {
                where: { createdAt: { gte: startDate, lte: endDate } },
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    const locationStats = {};

    employees.forEach(emp => {
        const loc = emp.location || 'Remote';
        if (!locationStats[loc]) {
            locationStats[loc] = { name: loc, employees: 0, workHours: 0 };
        }
        locationStats[loc].employees += 1;
        
        const totalSeconds = emp.attendance.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        locationStats[loc].workHours += totalSeconds / 3600;
    });

    return Object.values(locationStats);
};

/**
 * Workload Distribution Report: Hours worked vs optimal range.
 */
const getWorkloadReport = async (organizationId, startDate, endDate) => {
    const teams = await prisma.team.findMany({
        where: { organizationId },
        include: {
            employees: {
                include: {
                    attendance: {
                        where: { date: { gte: startDate, lte: endDate } }
                    }
                }
            }
        }
    });

    return teams.map(team => {
        let totalHours = 0;
        let totalCapacity = team.employees.length * 40; // Assuming 40h per week capacity for now

        team.employees.forEach(emp => {
            const hours = emp.attendance.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 3600;
            totalHours += hours;
        });

        return {
            team: team.name,
            hours: Math.round(totalHours * 10) / 10,
            capacity: totalCapacity || 1,
            employeeCount: team.employees.length
        };
    });
};

module.exports = {
    getWorkTypeReport,
    getAppsReport,
    getAdherenceReport,
    getLocationInsights,
    getWorkloadReport
};
