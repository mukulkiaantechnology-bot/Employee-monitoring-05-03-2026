const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAdminDashboard = async (organizationId) => {
  const [employees, teams, totalAttendance, totalActivity] = await Promise.all([
    prisma.employee.findMany({ where: { organizationId } }),
    prisma.team.findMany({ where: { organizationId } }),
    prisma.attendance.count({ where: { organizationId } }),
    prisma.activityLog.aggregate({
      where: { organizationId },
      _sum: { duration: true }
    })
  ]);

  return {
    employees,
    teams,
    totalAttendance,
    totalWorkHours: (totalActivity._sum.duration || 0) / 3600,
    productivityScore: 85 // Mocked for now, or calculate if data exists
  };
};

const getManagerDashboard = async (organizationId, teamId) => {
  const [employees, activityLogs, tasks, attendance] = await Promise.all([
    prisma.employee.findMany({ where: { organizationId, teamId } }),
    prisma.activityLog.findMany({
      where: { organizationId, employee: { teamId } },
      take: 10,
      orderBy: { timestamp: 'desc' }
    }),
    prisma.task.findMany({ where: { organizationId, employee: { teamId } } }),
    prisma.attendance.count({ where: { organizationId, employee: { teamId } } })
  ]);

  return {
    employees,
    activityLogs,
    tasks,
    attendanceCount: attendance
  };
};

const getEmployeeDashboard = async (organizationId, employeeId) => {
  const [activityLogs, attendance, tasks, screenshots] = await Promise.all([
    prisma.activityLog.findMany({
      where: { organizationId, employeeId },
      take: 20,
      orderBy: { timestamp: 'desc' }
    }),
    prisma.attendance.findMany({
      where: { organizationId, employeeId },
      take: 5,
      orderBy: { date: 'desc' }
    }),
    prisma.task.findMany({ where: { organizationId, employeeId } }),
    prisma.screenshot.findMany({
      where: { organizationId, employeeId },
      take: 5,
      orderBy: { capturedAt: 'desc' }
    })
  ]);

  const totalDuration = activityLogs.reduce((acc, log) => acc + log.duration, 0);

  return {
    activityLogs,
    attendance,
    tasks,
    screenshots,
    workHours: totalDuration / 3600,
    productivityScore: 90, // Mocked
    // RBAC: Empty peer data for Employees
    topEmployees: [],
    topTeams: [],
    lowEmployees: [],
    lowTeams: []
  };
};

module.exports = {
  getAdminDashboard,
  getManagerDashboard,
  getEmployeeDashboard
};
