const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Activity Simulator Service
 * Periodically generates random activity logs for simulation purposes.
 */
class ActivitySimulator {
    constructor() {
        this.intervalId = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;

        console.log('🚀 Activity Simulator started...');
        this.isRunning = true;

        // Run simulation every 30 seconds
        this.intervalId = setInterval(() => {
            this.generateLogs();
        }, 30000);

        // Initial run
        this.generateLogs();
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('🛑 Activity Simulator stopped.');
    }

    async generateLogs() {
        try {
            // 1. Get all active employees (limit to a few for performance)
            const employees = await prisma.employee.findMany({
                where: { status: 'ACTIVE' },
                take: 10
            });

            if (employees.length === 0) {
                console.log('Simulator: No active employees found.');
                return;
            }

            const logsToCreate = [];

            for (const emp of employees) {
                // Randomly decide if they are ACTIVE, IDLE, or SYSTEM
                const types = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'IDLE', 'SYSTEM'];
                const activityType = types[Math.floor(Math.random() * types.length)];

                // Randomly decide productivity
                const prodTypes = ['PRODUCTIVE', 'PRODUCTIVE', 'NEUTRAL', 'UNPRODUCTIVE'];
                const productivity = prodTypes[Math.floor(Math.random() * prodTypes.length)];

                // Random apps/websites
                const apps = ['VS Code', 'Google Chrome', 'Slack', 'Terminal', 'Zoom', 'Spotify', 'YouTube'];
                const appWebsite = apps[Math.floor(Math.random() * apps.length)];

                logsToCreate.push({
                    employeeId: emp.id,
                    organizationId: emp.organizationId,
                    activityType,
                    productivity,
                    duration: 30, // 30 seconds per tick
                    appWebsite,
                    timestamp: new Date(),
                });
            }

            await prisma.activityLog.createMany({
                data: logsToCreate
            });

            console.log(`Simulator: Generated logs for ${employees.length} employees.`);
        } catch (error) {
            console.error('Simulator Error:', error.message);
        }
    }
}

module.exports = new ActivitySimulator();
