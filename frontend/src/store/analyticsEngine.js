/**
 * @file analyticsEngine.js
 * @description Pure computed functions for EMS analytics.
 * All functions are stateless and take raw data arrays as inputs.
 * Consumed via useMemo in RealTimeContext.
 */

// ─── CORE METRICS ──────────────────────────────────────────────────────────

/**
 * Productivity % = (Productive Time / Active Time) × 100
 */
export function productivityPct(productiveHours, activeHours) {
    if (!activeHours || activeHours === 0) return 0;
    return Math.min(100, Math.round((productiveHours / activeHours) * 100));
}

/**
 * Utilization % = (Active Time / Work Hours) × 100
 */
export function utilizationPct(activeHours, workHours) {
    if (!workHours || workHours === 0) return 0;
    return Math.min(100, Math.round((activeHours / workHours) * 100));
}

/**
 * Schedule Adherence % = (On-time Days / Total Workdays) × 100
 */
export function scheduleAdherence(attendanceLogs, employeeId) {
    const logs = attendanceLogs.filter(l => l.employeeId === employeeId && l.status === 'present');
    if (!logs.length) return 100;
    const onTime = logs.filter(l => !l.late).length;
    return Math.round((onTime / logs.length) * 100);
}

/**
 * Team Productivity = Average member productivity %
 */
export function teamProductivity(employees, teamName, activityLogs) {
    const members = employees.filter(e => e.team === teamName);
    if (!members.length) return 0;
    const scores = members.map(emp => {
        const logs = activityLogs.filter(l => l.employeeId === emp.id).slice(0, 7);
        if (!logs.length) return emp.productivityScore || 75;
        const avgPrd = logs.reduce((s, l) => s + l.productiveHours, 0);
        const avgAct = logs.reduce((s, l) => s + l.activeHours, 0);
        return productivityPct(avgPrd, avgAct);
    });
    return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
}

/**
 * Payroll Total = Σ (Active Hours × Hourly Rate)
 */
export function payrollTotal(employees, activityLogs) {
    return employees.reduce((total, emp) => {
        const empLogs = activityLogs.filter(l => l.employeeId === emp.id);
        const activeH = empLogs.reduce((s, l) => s + l.activeHours, 0);
        return total + Math.round(activeH * (emp.hourlyRate || 50));
    }, 0);
}

/**
 * Workload Distribution = Task count per employee
 */
export function workloadDistribution(tasks, employees) {
    return employees.map(emp => ({
        employeeId: emp.id,
        name: emp.name,
        team: emp.team,
        taskCount: tasks.filter(t => t.assigneeId === emp.id).length,
        completedCount: tasks.filter(t => t.assigneeId === emp.id && t.status === 'Completed').length,
        inProgressCount: tasks.filter(t => t.assigneeId === emp.id && t.status === 'In Progress').length,
    })).sort((a, b) => b.taskCount - a.taskCount);
}

/**
 * Intraday Activity = Aggregate all employee intradayBuckets for a date
 */
export function intradayActivity(activityLogs, dateStr) {
    const dayLogs = activityLogs.filter(l => l.date === dateStr);
    if (!dayLogs.length) {
        // fallback shape for chart
        return Array.from({ length: 11 }, (_, i) => ({ name: `${String(8+i).padStart(2,'0')}:00`, active: 0, idle: 0, manual: 0, break: 0 }));
    }
    const bucketMap = {};
    dayLogs.forEach(log => {
        (log.intradayBuckets || []).forEach(b => {
            if (!bucketMap[b.name]) bucketMap[b.name] = { name: b.name, active: 0, idle: 0, manual: 0, break: 0 };
            bucketMap[b.name].active  += b.active || 0;
            bucketMap[b.name].idle    += b.idle || 0;
            bucketMap[b.name].manual  += b.manual || 0;
            bucketMap[b.name].break   += b.break || 0;
        });
    });
    return Object.values(bucketMap).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Summary stats for a date range
 */
export function computeSummaryStats(activityLogs, dateStr) {
    const dayLogs = activityLogs.filter(l => l.date === dateStr);
    const totals = dayLogs.reduce((acc, l) => ({
        workHours:        acc.workHours + l.workHours,
        activeHours:      acc.activeHours + l.activeHours,
        idleHours:        acc.idleHours + l.idleHours,
        breakHours:       acc.breakHours + l.breakHours,
        productiveHours:  acc.productiveHours + l.productiveHours,
        neutralHours:     acc.neutralHours + l.neutralHours,
        unproductiveHours: acc.unproductiveHours + l.unproductiveHours,
    }), { workHours:0, activeHours:0, idleHours:0, breakHours:0, productiveHours:0, neutralHours:0, unproductiveHours:0 });

    const fmt = (h) => `${String(Math.floor(h)).padStart(2,'0')}h ${String(Math.round((h % 1) * 60)).padStart(2,'0')}m`;

    return {
        workTime:       fmt(totals.workHours),
        activeTime:     fmt(totals.activeHours),
        idleTime:       fmt(totals.idleHours),
        manualTime:     '00h 00m',
        productiveTime: fmt(totals.productiveHours),
        unproductiveTime: fmt(totals.unproductiveHours),
        neutralTime:    fmt(totals.neutralHours),
        utilization:    utilizationPct(totals.activeHours, totals.workHours),
        productivity:   productivityPct(totals.productiveHours, totals.activeHours),
    };
}

/**
 * App usage aggregated by category for last N days
 */
export function appUsageByCategory(appUsageLogs, days = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const recent = appUsageLogs.filter(l => new Date(l.date) >= cutoff);

    const byApp = {};
    recent.forEach(l => {
        if (!byApp[l.app]) byApp[l.app] = { app: l.app, category: l.category, minutes: 0, users: new Set() };
        byApp[l.app].minutes += l.minutes;
        byApp[l.app].users.add(l.employeeId);
    });

    return Object.values(byApp)
        .map(a => ({ ...a, users: a.users.size, timeStr: a.minutes >= 60 ? `${Math.floor(a.minutes/60)}h ${a.minutes%60}m` : `${a.minutes}m` }))
        .sort((a, b) => b.minutes - a.minutes)
        .slice(0, 15);
}

/**
 * Schedule Adherence by employee for reports
 */
export function buildScheduleAdherenceData(employees, attendanceLogs) {
    return employees.map(emp => {
        const logs = attendanceLogs.filter(l => l.employeeId === emp.id && l.status !== 'absent');
        const onTime = logs.filter(l => !l.late && l.status === 'present').length;
        const total = logs.filter(l => l.status === 'present').length;
        const adherence = total === 0 ? 100 : Math.round((onTime / total) * 100);
        return { name: emp.name, team: emp.team, adherence, onTime, total, missed: total - onTime };
    }).sort((a, b) => a.adherence - b.adherence);
}

/**
 * Alert threshold check — generates new alerts from current state
 */
export function checkAlertThresholds(employees, activityLogs, existingAlerts, settings = {}) {
    const { idleThresholdHours = 2.5, unproductivePct = 40 } = settings;
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = activityLogs.filter(l => l.date === today);
    const newAlerts = [];
    let idNext = Date.now();

    todayLogs.forEach(log => {
        const emp = employees.find(e => e.id === log.employeeId);
        if (!emp) return;
        const alreadyExists = existingAlerts.some(
            a => a.employeeId === emp.id && a.date === today && a.type === 'idle'
        );
        if (!alreadyExists && log.idleHours > idleThresholdHours) {
            newAlerts.push({
                id: idNext++, type: 'idle', severity: 'warning',
                employeeId: emp.id, employeeName: emp.name, team: emp.team,
                message: `${emp.name} idle for ${log.idleHours.toFixed(1)}h today`,
                date: today, read: false, createdAt: today,
            });
        }
        if (!alreadyExists && log.productivityPct < unproductivePct) {
            newAlerts.push({
                id: idNext++, type: 'unproductive', severity: 'critical',
                employeeId: emp.id, employeeName: emp.name, team: emp.team,
                message: `${emp.name} productivity at ${log.productivityPct}% today`,
                date: today, read: false, createdAt: today,
            });
        }
    });
    return newAlerts;
}

/**
 * Weekly productivity trend (last 7 days)
 */
export function weeklyProductivityTrend(activityLogs) {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const trend = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date('2026-02-28');
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const logs = activityLogs.filter(l => l.date === dateStr);
        const totPrd = logs.reduce((s, l) => s + l.productiveHours, 0);
        const totAct = logs.reduce((s, l) => s + l.activeHours, 0);
        const totWork = logs.reduce((s, l) => s + l.workHours, 0);
        trend.push({
            name: days[d.getDay()],
            productivity: productivityPct(totPrd, totAct),
            utilization: utilizationPct(totAct, totWork),
            hours: Math.round(totWork),
        });
    }
    return trend;
}

/**
 * Live employee stats for Real-time Insights
 */
export function liveEmployeeStats(employees) {
    return {
        total:   employees.length,
        online:  employees.filter(e => e.status === 'online').length,
        idle:    employees.filter(e => e.status === 'idle').length,
        offline: employees.filter(e => e.status === 'offline').length,
    };
}
