/**
 * @file seedEngine.js
 * @description Deterministic seed engine for the EMS simulation.
 * Generates 30-day logs for all 20 employees: attendance, activity,
 * app usage, location, screenshots, payroll, tasks, and alerts.
 * Uses employee ID as the random seed for mathematical consistency.
 */

// ---------- CONSTANTS ----------
const TEAMS = ['Engineering', 'Sales', 'HR', 'Operations'];
const APPS_PRODUCTIVE = ['VS Code', 'Figma', 'Jira', 'GitHub', 'Notion', 'IntelliJ IDEA', 'Postman', 'Linear'];
const APPS_NEUTRAL = ['Slack', 'Zoom', 'Google Meet', 'Microsoft Teams', 'Outlook', 'Gmail'];
const APPS_UNPRODUCT = ['YouTube', 'Twitter/X', 'Reddit', 'ESPN', 'Netflix', 'Facebook'];
const PROJECTS_LIST = ['Cloud Migration', 'Mobile App Revamp', 'Internal Audit UI', 'E-commerce Integration', 'Security Patching', 'HR Portal V2'];
const TASK_STATUSES = ['To Do', 'In Progress', 'In Review', 'Completed'];
const HOURLY_RATES = { Engineering: 72, Sales: 55, HR: 48, Operations: 52 };
const SEED_KEY = 'ems_seed_v3';
const DAYS = 30;

// ---------- SEEDED PSEUDO-RANDOM (deterministic per employee) ----------
function seededRand(seed) {
    let s = seed;
    return function () {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 4294967296;
    };
}

function randBetween(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
}

// ---------- DATE HELPERS ----------
function daysAgo(n) {
    const d = new Date('2026-02-28');
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}

function formatHHMM(h, m) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function isoDate(dateStr, hour, min) {
    return `${dateStr}T${formatHHMM(hour, min)}:00.000Z`;
}

// ---------- SEED EMPLOYEES (enriched from mockData) ----------
const SEED_EMPLOYEES = [
    { id: 1, name: 'John Doe', role: 'Senior Software Engineer', department: 'Engineering', team: 'Engineering', lat: 40.7128, lng: -74.0060, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Jane Smith', role: 'Lead Product Manager', department: 'Engineering', team: 'Engineering', lat: 40.7580, lng: -73.9855, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Alex Johnson', role: 'Senior UI/UX Designer', department: 'HR', team: 'HR', lat: 40.7484, lng: -73.9857, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Sarah Brown', role: 'DevOps Specialist', department: 'Engineering', team: 'Engineering', lat: 40.6892, lng: -74.0445, avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, name: 'Michael Lee', role: 'QA Automation Lead', department: 'Engineering', team: 'Engineering', lat: 40.7282, lng: -73.7949, avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, name: 'David Wilson', role: 'Frontend Architect', department: 'Engineering', team: 'Engineering', lat: 40.7614, lng: -73.9776, avatar: 'https://i.pravatar.cc/150?u=6' },
    { id: 7, name: 'Emma Davis', role: 'Backend Developer', department: 'Engineering', team: 'Engineering', lat: 40.7549, lng: -73.9840, avatar: 'https://i.pravatar.cc/150?u=7' },
    { id: 8, name: 'James Miller', role: 'VP of Marketing', department: 'Operations', team: 'Operations', lat: 40.7127, lng: -74.0059, avatar: 'https://i.pravatar.cc/150?u=8' },
    { id: 9, name: 'Olivia Taylor', role: 'Account Executive', department: 'Sales', team: 'Sales', lat: 40.7308, lng: -73.9973, avatar: 'https://i.pravatar.cc/150?u=9' },
    { id: 10, name: 'Robert Moore', role: 'HR Director', department: 'HR', team: 'HR', lat: 40.7046, lng: -74.0130, avatar: 'https://i.pravatar.cc/150?u=10' },
    { id: 11, name: 'Sophia White', role: 'Data Scientist', department: 'Engineering', team: 'Engineering', lat: 40.7589, lng: -73.9851, avatar: 'https://i.pravatar.cc/150?u=11' },
    { id: 12, name: 'Liam Garcia', role: 'System Administrator', department: 'Operations', team: 'Operations', lat: 40.6501, lng: -73.9496, avatar: 'https://i.pravatar.cc/150?u=12' },
    { id: 13, name: 'Isabella Chen', role: 'Content Strategist', department: 'Sales', team: 'Sales', lat: 40.7488, lng: -73.9680, avatar: 'https://i.pravatar.cc/150?u=13' },
    { id: 14, name: 'Ethan Hunt', role: 'Security Analyst', department: 'Engineering', team: 'Engineering', lat: 40.7589, lng: -73.8777, avatar: 'https://i.pravatar.cc/150?u=14' },
    { id: 15, name: 'Mia Wong', role: 'Customer Success', department: 'Sales', team: 'Sales', lat: 40.7411, lng: -74.0018, avatar: 'https://i.pravatar.cc/150?u=15' },
    { id: 16, name: 'Noah Adams', role: 'Full Stack Dev', department: 'Engineering', team: 'Engineering', lat: 40.7282, lng: -73.7949, avatar: 'https://i.pravatar.cc/150?u=16' },
    { id: 17, name: 'Ava Martinez', role: 'UI Designer', department: 'HR', team: 'HR', lat: 40.6892, lng: -74.0445, avatar: 'https://i.pravatar.cc/150?u=17' },
    { id: 18, name: 'William Clark', role: 'Cloud Architect', department: 'Engineering', team: 'Engineering', lat: 40.7549, lng: -73.9840, avatar: 'https://i.pravatar.cc/150?u=18' },
    { id: 19, name: 'Charlotte King', role: 'Product Analyst', department: 'Operations', team: 'Operations', lat: 40.7614, lng: -73.9776, avatar: 'https://i.pravatar.cc/150?u=19' },
    { id: 20, name: 'Lucas Scott', role: 'Sales Manager', department: 'Sales', team: 'Sales', lat: 40.7308, lng: -73.9973, avatar: 'https://i.pravatar.cc/150?u=20' },
];

// ---------- ENRICHED EMPLOYEES (with computed metadata) ----------
function buildEnrichedEmployees() {
    return SEED_EMPLOYEES.map(emp => {
        const rng = seededRand(emp.id * 31337);
        const baseRate = (HOURLY_RATES[emp.team] || 50) + randBetween(rng, -5, 15);
        const productivityScore = randBetween(rng, 68, 97);
        const utilizationScore = randBetween(rng, 72, 95);

        // Diverse status distribution for 20 employees
        let status = 'active';
        if (emp.id % 5 === 0) status = 'pending';
        else if (emp.id % 7 === 0) status = 'deactivated';
        else if (emp.id % 9 === 0) status = 'merged';
        else if (emp.id % 3 === 0) status = 'idle';
        else if (emp.id % 4 === 0) status = 'offline';
        else status = 'active';

        return {
            ...emp,
            hourlyRate: baseRate,
            productivityScore,
            utilizationScore,
            status,
            productiveHours: `${String(Math.floor(productivityScore * 8 / 100)).padStart(2, '0')}:${String(randBetween(rng, 0, 59)).padStart(2, '0')}`,
            unproductiveHours: `0${randBetween(rng, 0, 3)}:${String(randBetween(rng, 0, 59)).padStart(2, '0')}`,
            utilization: utilizationScore,
        };
    });
}

// ---------- ATTENDANCE LOGS (30 days × N employees) ----------
export function buildAttendanceLogs(employees) {
    const logs = [];
    employees.forEach(emp => {
        const rng = seededRand(emp.id * 99991);
        for (let day = 0; day < DAYS; day++) {
            const dateStr = daysAgo(day);
            const d = new Date(dateStr);
            const dow = d.getDay(); // 0 = Sun, 6 = Sat
            if (dow === 0 || dow === 6) continue; // skip weekends

            const r = rng();
            let status, checkIn, checkOut, late = false, earlyLeave = false;
            if (r < 0.03) {
                status = 'absent';
            } else if (r < 0.06) {
                status = 'leave';
            } else {
                status = 'present';
                const lateMin = rng() < 0.15 ? randBetween(rng, 10, 45) : 0;
                const checkInH = lateMin > 0 ? 9 : 9;
                const checkInM = lateMin > 0 ? lateMin : randBetween(rng, 0, 5);
                late = lateMin > 10;
                const workHours = randBetween(rng, 7, 10);
                const checkOutH = checkInH + workHours;
                const checkOutM = randBetween(rng, 0, 59);
                earlyLeave = checkOutH < 17;
                checkIn = `${formatHHMM(checkInH, checkInM)} AM`;
                checkOut = `${formatHHMM(checkOutH > 12 ? checkOutH - 12 : checkOutH, checkOutM)} ${checkOutH >= 12 ? 'PM' : 'AM'}`;
            }

            logs.push({
                id: `att-${emp.id}-${day}`,
                employeeId: emp.id,
                employeeName: emp.name,
                date: dateStr,
                status,
                checkIn: checkIn || null,
                checkOut: checkOut || null,
                shift: 'Day Shift',
                late,
                earlyLeave,
            });
        }
    });
    return logs;
}

// ---------- ACTIVITY LOGS (30 days × N employees) ----------
export function buildActivityLogs(employees) {
    const logs = [];
    employees.forEach(emp => {
        const rng = seededRand(emp.id * 77777);
        for (let day = 0; day < DAYS; day++) {
            const dateStr = daysAgo(day);
            const d = new Date(dateStr);
            if (d.getDay() === 0 || d.getDay() === 6) continue;

            const workHours = 8 + rng() * 2;
            const activeRatio = (emp.productivityScore / 100) * (0.85 + rng() * 0.15);
            const activeHours = parseFloat((workHours * activeRatio).toFixed(2));
            const idleHours = parseFloat((workHours * (1 - activeRatio) * 0.6).toFixed(2));
            const breakHours = parseFloat((workHours - activeHours - idleHours).toFixed(2));
            const productiveH = parseFloat((activeHours * (emp.productivityScore / 100)).toFixed(2));
            const neutralH = parseFloat((activeHours * 0.15).toFixed(2));
            const unproductH = parseFloat((activeHours - productiveH - neutralH).toFixed(2));

            // Intraday buckets (hourly, 08-18)
            const intradayBuckets = [];
            for (let h = 8; h <= 18; h++) {
                const isLunch = h === 12 || h === 13;
                const active = isLunch ? randBetween(rng, 2, 8) : randBetween(rng, 20, Math.round(activeHours * 6));
                const idle = randBetween(rng, 0, isLunch ? 20 : 10);
                const manual = Math.random() > 0.7 ? randBetween(rng, 0, 5) : 0;
                intradayBuckets.push({ hour: h, name: `${String(h).padStart(2, '0')}:00`, active, idle, manual, break: isLunch ? randBetween(rng, 20, 45) : 0 });
            }

            logs.push({
                id: `act-${emp.id}-${day}`,
                employeeId: emp.id,
                employeeName: emp.name,
                team: emp.team,
                date: dateStr,
                workHours: parseFloat(workHours.toFixed(2)),
                activeHours,
                idleHours,
                breakHours: Math.max(0, breakHours),
                productiveHours: productiveH,
                neutralHours: neutralH,
                unproductiveHours: Math.max(0, unproductH),
                productivityPct: Math.round((productiveH / activeHours) * 100),
                utilizationPct: Math.round((activeHours / workHours) * 100),
                intradayBuckets,
            });
        }
    });
    return logs;
}

// ---------- APP USAGE LOGS ----------
export function buildAppUsageLogs(employees) {
    const logs = [];
    employees.forEach(emp => {
        const rng = seededRand(emp.id * 54321);
        for (let day = 0; day < 7; day++) { // last 7 days of app logs
            const dateStr = daysAgo(day);
            const d = new Date(dateStr);
            if (d.getDay() === 0 || d.getDay() === 6) continue;

            const appsToday = randBetween(rng, 3, 6);
            for (let a = 0; a < appsToday; a++) {
                const category = rng() < 0.6 ? 'productive' : rng() < 0.8 ? 'neutral' : 'unproductive';
                const appList = category === 'productive' ? APPS_PRODUCTIVE : category === 'neutral' ? APPS_NEUTRAL : APPS_UNPRODUCT;
                const appName = pick(rng, appList);
                const minutes = randBetween(rng, 5, category === 'productive' ? 180 : 60);
                logs.push({
                    id: `app-${emp.id}-${day}-${a}`,
                    employeeId: emp.id,
                    employeeName: emp.name,
                    team: emp.team,
                    date: dateStr,
                    app: appName,
                    category,
                    minutes,
                    timeStr: minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`,
                });
            }
        }
    });
    return logs;
}

// ---------- LOCATION LOGS ----------
export function buildLocationLogs(employees) {
    return employees.map(emp => {
        const rng = seededRand(emp.id * 11111);
        const deltaLat = (rng() - 0.5) * 0.01;
        const deltaLng = (rng() - 0.5) * 0.01;
        const statuses = ['moving', 'stationary', 'moving', 'stationary', 'stationary'];
        return {
            id: emp.id,
            employeeId: emp.id,
            name: emp.name,
            team: emp.team,
            lat: emp.lat + deltaLat,
            lng: emp.lng + deltaLng,
            status: statuses[emp.id % statuses.length],
            lastSync: `${randBetween(rng, 1, 10)}m ago`,
            address: `${randBetween(rng, 100, 999)} Main St, New York, NY`,
            speed: statuses[emp.id % statuses.length] === 'moving' ? `${randBetween(rng, 5, 40)} km/h` : '0 km/h',
        };
    });
}

// ---------- SEEDED SCREENSHOTS ----------
export function buildScreenshots(employees) {
    const SEEDS = ['aa1', 'ab2', 'ac3', 'ad4', 'ae5', 'af6', 'ba1', 'bb2', 'bc3', 'bd4', 'be5', 'bf6', 'ca1', 'cb2', 'cc3'];
    const screenshots = [];
    let id = 1;
    employees.forEach(emp => {
        const rng = seededRand(emp.id * 22222);
        const count = randBetween(rng, 4, 8);
        for (let i = 0; i < count; i++) {
            const hour = randBetween(rng, 9, 17);
            const min = randBetween(rng, 0, 59);
            const prod = rng() < 0.7 ? 'productive' : rng() < 0.8 ? 'neutral' : 'unproductive';
            screenshots.push({
                id: id++,
                employeeId: emp.id,
                employee: emp.name,
                team: emp.team,
                time: `${hour > 12 ? hour - 12 : hour}:${String(min).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`,
                date: daysAgo(Math.floor(i / 2)),
                url: `https://picsum.photos/seed/${SEEDS[id % SEEDS.length]}/800/450`,
                isBlurred: prod === 'unproductive',
                productivity: prod,
                type: rng() < 0.8 ? 'automatic' : 'manual',
                app: pick(rng, APPS_PRODUCTIVE),
                project: pick(rng, PROJECTS_LIST),
                task: pick(rng, ['Development', 'Code Review', 'Design', 'Testing', 'Meeting', 'Documentation']),
                timestamp: isoDate(daysAgo(Math.floor(i / 2)), hour, min),
            });
        }
    });
    return screenshots;
}

// ---------- TASKS ----------
export function buildTasks(employees) {
    const TASK_TITLES = [
        'Database Schema Design', 'API Authentication Layer', 'UI Mockups', 'Bug Fix: Login Loop',
        'Performance Optimization', 'Unit Test Coverage', 'Deploy to Staging', 'Code Review',
        'Security Audit', 'Documentation Update', 'Feature: Dark Mode', 'Integration Testing',
        'Refactor Legacy Code', 'Mobile Responsive Fix', 'CI/CD Pipeline', 'Load Testing',
        'User Research', 'A/B Testing Setup', 'Data Migration', 'Monitoring Alerts Setup',
        'Dashboard Analytics', 'Payment Gateway', 'Notification System', 'Search Optimization',
        'Cache Layer', 'Rate Limiting', 'OAuth Integration', 'CSV Export', 'Email Templates',
    ];
    const tasks = [];
    let taskId = 1;

    PROJECTS_LIST.forEach((project, pi) => {
        const taskCount = 18 + pi * 3;
        for (let i = 0; i < taskCount; i++) {
            const empIdx = (taskId + pi) % employees.length;
            const emp = employees[empIdx];
            const rng = seededRand(taskId * 33333);
            const statusIdx = Math.floor(rng() * TASK_STATUSES.length);
            const progress = statusIdx === 3 ? 100 : statusIdx === 2 ? randBetween(rng, 70, 95) : statusIdx === 1 ? randBetween(rng, 10, 65) : 0;
            tasks.push({
                id: taskId++,
                title: TASK_TITLES[i % TASK_TITLES.length] + (i > TASK_TITLES.length ? ` v${Math.floor(i / TASK_TITLES.length) + 1}` : ''),
                project,
                priority: pick(rng, ['Low', 'Medium', 'High', 'Critical']),
                assignee: emp.name,
                assigneeId: emp.id,
                team: emp.team,
                status: TASK_STATUSES[statusIdx],
                progress,
                timeSpent: `${randBetween(rng, 1, 20)}h ${randBetween(rng, 0, 59)}m`,
                dueDate: daysAgo(randBetween(rng, -14, 14)),
                createdAt: daysAgo(randBetween(rng, 15, 30)),
            });
        }
    });

    return tasks;
}

// ---------- AUTO-GENERATED ALERTS ----------
export function buildAlerts(employees, activityLogs) {
    const alerts = [];
    let alertId = 1;

    employees.forEach(emp => {
        const recentLogs = activityLogs.filter(l => l.employeeId === emp.id).slice(0, 5);
        recentLogs.forEach(log => {
            if (log.idleHours > 2.5) {
                alerts.push({
                    id: alertId++,
                    type: 'idle',
                    severity: 'warning',
                    employeeId: emp.id,
                    employeeName: emp.name,
                    team: emp.team,
                    message: `${emp.name} was idle for ${log.idleHours.toFixed(1)}h on ${log.date}`,
                    date: log.date,
                    read: false,
                    createdAt: log.date,
                });
            }
            if (log.productivityPct < 55) {
                alerts.push({
                    id: alertId++,
                    type: 'unproductive',
                    severity: 'critical',
                    employeeId: emp.id,
                    employeeName: emp.name,
                    team: emp.team,
                    message: `${emp.name}'s productivity dropped to ${log.productivityPct}% on ${log.date}`,
                    date: log.date,
                    read: false,
                    createdAt: log.date,
                });
            }
        });
    });

    // Late login alerts
    employees.slice(0, 5).forEach((emp, i) => {
        alerts.push({
            id: alertId++,
            type: 'late_login',
            severity: 'info',
            employeeId: emp.id,
            employeeName: emp.name,
            team: emp.team,
            message: `${emp.name} checked in 25 minutes late on ${daysAgo(i + 1)}`,
            date: daysAgo(i + 1),
            read: i > 2,
            createdAt: daysAgo(i + 1),
        });
    });

    return alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 40);
}

// ---------- PAYROLL DATA ----------
export function buildPayrollData(employees, activityLogs) {
    return employees.map(emp => {
        const empLogs = activityLogs.filter(l => l.employeeId === emp.id);
        const totalActiveH = empLogs.reduce((s, l) => s + l.activeHours, 0);
        const grossPay = Math.round(totalActiveH * emp.hourlyRate);
        const deductions = Math.round(grossPay * 0.22);
        const netPay = grossPay - deductions;
        return {
            id: emp.id,
            employee: emp.name,
            role: emp.role,
            team: emp.team,
            period: 'Feb 1 - Feb 28, 2026',
            totalHours: parseFloat(totalActiveH.toFixed(1)),
            overTime: parseFloat(Math.max(0, totalActiveH - 160).toFixed(1)),
            hourlyRate: emp.hourlyRate,
            grossPay: `$${grossPay.toLocaleString()}`,
            grossPayValue: grossPay,
            deductions,
            netPay,
            status: totalActiveH > 100 ? 'Ready' : 'Pending',
        };
    });
}

// ---------- MAIN EXPORT ----------
export function generateSeedData() {
    // Check if seed already generated for this version
    const cached = localStorage.getItem(SEED_KEY);
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch (e) {
            // corrupted — regenerate
        }
    }

    const employees = buildEnrichedEmployees();
    const attendanceLogs = buildAttendanceLogs(employees);
    const activityLogs = buildActivityLogs(employees);
    const appUsageLogs = buildAppUsageLogs(employees);
    const locationLogs = buildLocationLogs(employees);
    const screenshots = buildScreenshots(employees);
    const tasks = buildTasks(employees);
    const alerts = buildAlerts(employees, activityLogs);
    const payrollData = buildPayrollData(employees, activityLogs);

    const data = {
        employees,
        attendanceLogs,
        activityLogs,
        appUsageLogs,
        locationLogs,
        screenshots,
        tasks,
        alerts,
        payrollData,
        teams: TEAMS.map((name, i) => ({
            id: i + 1,
            name,
            lead: employees.find(e => e.team === name)?.name || 'TBD',
            members: employees.filter(e => e.team === name).length,
            color: ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500'][i],
            productivity: Math.round(
                employees.filter(e => e.team === name).reduce((s, e) => s + e.productivityScore, 0) /
                Math.max(1, employees.filter(e => e.team === name).length)
            ),
        })),
        projects: PROJECTS_LIST.map((name, i) => {
            const projectTasks = tasks.filter(t => t.project === name);
            const done = projectTasks.filter(t => t.status === 'Completed').length;
            const progress = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;
            return {
                id: i + 1,
                name,
                client: ['Alpha Corp', 'Beta Systems', 'Internal', 'Retail Giant', 'Global Bank', 'Internal'][i],
                progress,
                status: progress > 80 ? 'On Track' : progress > 50 ? 'At Risk' : progress > 20 ? 'Delayed' : 'Planning',
                color: ['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-slate-500'][i],
                taskCount: projectTasks.length,
                memberIds: [...new Set(projectTasks.map(t => t.assigneeId))].slice(0, 5),
            };
        }),
    };

    // Cache it
    try {
        localStorage.setItem(SEED_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Seed cache failed (quota exceeded), running without cache');
    }

    return data;
}

export { TEAMS, PROJECTS_LIST, TASK_STATUSES };
