import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Clock,
    CalendarCheck,
    Activity,
    MapPin,
    CheckSquare,
    BarChart3,
    CreditCard,
    Bell,
    Users,
    Settings,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Monitor,
    Zap,
    X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '../store/authStore';

const cn = (...inputs) => twMerge(clsx(inputs));

const navItems = [
    { name: 'Productivity Trends', icon: LayoutDashboard, path: '/', key: 'dashboard' },
    { name: 'Real-time Insights', icon: Zap, path: '/real-time', key: 'realtime' },
    // { name: 'Alerts', icon: Bell, path: '/alerts', key: 'alerts' },
    { name: 'Employees', icon: Users, path: '/employees', key: 'employees' },
    { name: 'Teams', icon: Users, path: '/teams', key: 'teams' },
    { name: 'Screenshot Monitoring', icon: Monitor, path: '/screenshots', key: 'screenshots' },
    { name: 'Time & Attendance', icon: Clock, path: '/time-attendance', key: 'timeAttendance' },
    { name: 'Activity Monitoring', icon: Activity, path: '/activity', key: 'activity' },
    { name: 'Projects', icon: CheckSquare, path: '/projects', key: 'projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks', key: 'tasks' },
    { name: 'Payroll', icon: CreditCard, path: '/payroll', key: 'payroll' },
    { name: 'Compliance', icon: ShieldCheck, path: '/compliance', key: 'compliance' },
    { name: 'Settings', icon: Settings, path: '/settings', key: 'settings' },
];

const reportSubItems = [
    { name: 'Work Type', path: '/reports/work-type' },
    { name: 'Schedule Adherence', path: '/reports/schedule-adherence' },
    { name: 'Workload Distribution', path: '/reports/workload-distribution' },
    { name: 'Apps & Websites', path: '/reports/apps-websites' },
    { name: 'Location Insights', path: '/reports/location-insights' },
];

export function Sidebar({ collapsed, setCollapsed, onMobileClose }) {
    const [reportsOpen, setReportsOpen] = React.useState(false);
    const { hasAccess, role } = useAuthStore();
    const location = React.useRef(window.location.pathname);

    const rolePath = role ? `/${role.toLowerCase()}` : '';

    // Filter nav items based on RBAC and inject role path
    const allowedNavItems = navItems
        .filter(item => {
            if (!hasAccess(item.key)) return false;
            // Employees should not see 'Screenshot Monitoring' in sidebar to keep it clean,
            // as they have 'Recent Captures' in their dashboard.
            if (role === 'EMPLOYEE' && item.key === 'screenshots') return false;
            return true;
        })
        .map(item => ({
            ...item,
            path: `${rolePath}${item.path === '/' ? '' : item.path}`
        }));

    const allowedReportSubItems = reportSubItems.map(item => ({
        ...item,
        path: `${rolePath}${item.path}`
    }));

    // Update reportsOpen if we are on a reports subpage
    React.useEffect(() => {
        if (window.location.pathname.includes('/reports')) {
            setReportsOpen(true);
        }
    }, []);

    return (
        <aside
            className={cn(
                "h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-500 ease-in-out",
                "w-[80vw] max-w-[300px] lg:max-w-none shadow-sm lg:shadow-none",
                collapsed ? "lg:w-20" : "lg:w-64"
            )}
        >
            <div className="flex h-16 items-center justify-between px-4 mt-6">
                {!collapsed && (
                    <div className="group cursor-pointer animate-in fade-in duration-500">
                        <h2 className="text-2xl font-black leading-none tracking-tighter bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110">
                            EMPLOYEE<br />
                            MANAGEMENT
                        </h2>
                        <div className="h-1 w-0 bg-primary-600 transition-all duration-300 group-hover:w-full mt-1 rounded-full opacity-50"></div>
                    </div>
                )}
                {collapsed && (
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:scale-110 hover:rotate-3 cursor-pointer">
                        <span className="text-xl font-black italic tracking-tighter">E</span>
                    </div>
                )}
                <button
                    onClick={onMobileClose}
                    className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <nav className="mt-6 flex flex-col gap-1 px-2 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-thin pb-20">
                {allowedNavItems.map((item, i) => {
                    // Inject Reports group before Payroll (which is key 'payroll') or at a reasonable spot
                    // In our case, if 'reports' is allowed (Admin or Manager), we show it.
                    const isReportsAllowed = hasAccess('reports');

                    // Simple logic: if this is the first item after 'Tasks', inject Reports
                    const showReportsBefore = item.key === 'payroll' || item.key === 'settings';
                    const isLastItemInGroup = item.key === 'tasks';

                    return (
                        <React.Fragment key={item.key}>
                            <NavLink
                                to={item.path}
                                onClick={onMobileClose}
                                className={({ isActive }) => cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-all duration-300 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                                    isActive && "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-bold",
                                    collapsed && "justify-center"
                                )}
                                title={collapsed ? item.name : ""}
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon size={22} className="transition-transform group-hover:scale-110" />
                                        {!collapsed && <span className="font-medium tracking-tight">{item.name}</span>}
                                        {isActive && !collapsed && (
                                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse"></div>
                                        )}
                                    </>
                                )}
                            </NavLink>

                            {isLastItemInGroup && isReportsAllowed && (
                                <div className="space-y-1 my-1">
                                    <button
                                        onClick={() => {
                                            if (collapsed) setCollapsed(false);
                                            setReportsOpen(!reportsOpen);
                                        }}
                                        className={cn(
                                            "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-all duration-300 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50",
                                            window.location.pathname.includes('/reports') && "text-primary-600 dark:text-primary-400 font-bold",
                                            collapsed && "justify-center"
                                        )}
                                    >
                                        <BarChart3 size={22} className="transition-transform group-hover:scale-110" />
                                        {!collapsed && <span className="font-medium tracking-tight">Reports</span>}
                                        {!collapsed && (
                                            <ChevronRight
                                                size={16}
                                                className={cn(
                                                    "ml-auto transition-transform duration-300",
                                                    reportsOpen && "rotate-90"
                                                )}
                                            />
                                        )}
                                    </button>

                                    {reportsOpen && !collapsed && (
                                        <div className="ml-9 flex flex-col gap-1 border-l-2 border-slate-100 dark:border-slate-800 pl-2 animate-in slide-in-from-left-2 duration-300">
                                            {allowedReportSubItems.map((subItem) => (
                                                <NavLink
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    onClick={onMobileClose}
                                                    className={({ isActive }) => cn(
                                                        "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                                        isActive
                                                            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                                    )}
                                                >
                                                    {subItem.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 hidden lg:flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xl transition-all hover:scale-110 hover:bg-primary-600 hover:text-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 z-50"
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </aside>
    );
}
