import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Clock,
    Activity,
    TrendingUp,
    TrendingDown,
    Filter,
    Download,
    ChevronDown,
    Plus,
    Calendar,
    ArrowRightLeft,
    MoreHorizontal,
    Monitor,
    Globe,
    Zap
} from 'lucide-react';
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Bar
} from 'recharts';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { FilterDropdown } from '../components/FilterDropdown';
import { GlobalCalendar } from '../components/GlobalCalendar';
import { useRealTime } from '../hooks/RealTimeContext';
import { useAuthStore } from '../store/authStore';

const SummaryCard = ({ title, value, trend, subValue, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md h-full">
        <div className="flex justify-between items-start mb-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">{title}</span>
            <Icon size={14} className="text-slate-400 dark:text-slate-500" />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{value}</h3>
            {trend && (
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {trend.startsWith('-') ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                    {trend}
                </span>
            )}
        </div>
        {subValue && <div className="text-[10px] text-slate-400 font-medium">{subValue}</div>}
    </div>
);

const EmployeeTable = ({ title, data, type }) => (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <button className="text-[10px] font-black text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 uppercase tracking-wider">View all</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead className="bg-[#fcfdfe] dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        <th className="px-4 py-2.5">{title.includes('Team') ? 'Team' : 'Employee'}</th>
                        <th className="px-4 py-2.5 text-right">Productive (h)</th>
                        <th className="px-4 py-2.5 text-right">Unproductive (h)</th>
                        <th className="px-4 py-2.5 text-right">Utilization {type === 'up' ? '↑' : '↓'}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {data.map((emp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-[10px] font-black text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                                        {emp.initials}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{emp.name}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{emp.team}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-700 dark:text-slate-300">{emp.productive}</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-700 dark:text-slate-300">{emp.unproductive}</td>
                            <td className="px-4 py-3 text-right font-black text-slate-900 dark:text-white">{emp.utilization}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const CategoryTable = ({ data }) => (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Top Categories</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead className="bg-[#fcfdfe] dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                    <tr>
                        <th className="px-4 py-2.5">Category Name</th>
                        <th className="px-4 py-2.5 text-right">Time ↓</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {data.map((cat, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{cat.name}</td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex flex-col items-end">
                                    <span className="font-black text-slate-900 dark:text-white">{cat.time}</span>
                                    <span className={`text-[10px] font-bold flex items-center gap-0.5 ${cat.trend.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {cat.trend.startsWith('-') ? '▼' : '▲'} {cat.trend}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const AppSection = ({ title }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
        <h3 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 self-start mb-8 uppercase tracking-tight">{title}</h3>
        <div className="w-32 h-24 bg-primary-50/50 dark:bg-primary-900/10 rounded-2xl relative mb-6 flex items-center justify-center border border-primary-100/50 dark:border-primary-900/30">
            <Monitor size={32} className="text-primary-200 dark:text-primary-800" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 items-center">
                <div className="w-8 h-1 bg-primary-100 dark:bg-primary-800/50 rounded-full"></div>
                <div className="w-4 h-1 bg-primary-100 dark:bg-primary-800/50 rounded-full"></div>
            </div>
        </div>
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight">No data for the selected period</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">Try choosing a different time period in the calendar.</p>
    </div>
);

import dashboardService from '../services/dashboardService';

const pieData = [
    { name: 'Productive', value: 75, color: '#6366f1' },
    { name: 'Unproductive', value: 15, color: '#f43f5e' },
    { name: 'Neutral', value: 10, color: '#94a3b8' }
];

const categories = [
    { name: 'Core Work', time: '5h 30m', trend: '+12%', color: '#6366f1' },
    { name: 'Communication', time: '1h 15m', trend: '-5%', color: '#22d3ee' },
    { name: 'Social Media', time: '0h 45m', trend: '+20%', color: '#f43f5e' },
    { name: 'Others', time: '0h 30m', trend: '+2%', color: '#cbd5e1' }
];

export function Dashboard() {
    const { employees: contextEmployees, teams: contextTeams, stats: realTimeStats, isLoading: isRealTimeLoading } = useRealTime();
    const { role } = useAuthStore();
    const [activeChartTab, setActiveChartTab] = useState('Activities');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pieData2, setPieData2] = useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                let data;
                if (role === 'ADMIN') {
                    data = await dashboardService.getAdminDashboard();
                } else if (role === 'MANAGER') {
                    data = await dashboardService.getManagerDashboard();
                } else {
                    data = await dashboardService.getEmployeeDashboard();
                }
                setDashboardData(data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [role]);

    const handleDownload = () => {
        const empMetricsData = realTimeStats.empMetrics || [];
        const headers = ['Employee Name', 'Team', 'Productive (h)', 'Unproductive (h)', 'Utilization (%)'];
        const rows = empMetricsData.map(e => [e.name, e.team, e.productive, e.unproductive, e.utilization]);
        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `productivity-report-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Use fetched dashboard data or fallback to real-time stats
    const stats = dashboardData || realTimeStats;

    const chartData = stats.intradayActivity?.length
        ? stats.intradayActivity
        : [
            { name: '08:00', active: 0, break: 0, manual: 0, idle: 0 },
            { name: '12:00', active: 0, break: 0, manual: 0, idle: 0 },
            { name: '18:00', active: 0, break: 0, manual: 0, idle: 0 },
        ];

    // ... (rest of the logic remains similar, but using 'stats' which is now role-aware)
    const employeesProd = stats.topProductive || [];
    const employeesUnprod = stats.topUnproductive || [];
    const teamsList = (stats.teams || stats.departmentStats || []).map(dept => ({
        initials: (dept.name || dept.fullName || '??').substring(0, 2).toUpperCase(),
        name: dept.name || dept.fullName,
        team: '',
        productive: dept.productivity ? `${dept.productivity}%` : '85%',
        unproductive: dept.productivity ? `${100 - dept.productivity}%` : '15%',
        utilization: dept.productivity || 85,
    }));

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Productivity Trends</h1>
                </div>
                <div className="flex items-center gap-4">

                    {role !== 'EMPLOYEE' && (
                        <div className="relative">
                            <button
                                onClick={() => navigate(`/${role.toLowerCase()}/employees`)}
                                title="View All Employees"
                                className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-all active:scale-95"
                            >
                                <Users size={18} />
                            </button>
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#fcfdfe] dark:border-slate-950 pointer-events-none">{contextEmployees.length || 0}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-3 mb-8">
                <GlobalCalendar />
                <FilterDropdown />
                <div className="ml-auto">
                    <button
                        onClick={handleDownload}
                        title="Export productivity report as CSV"
                        className="p-2 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 dark:hover:border-primary-900/30 transition-all hover:text-primary-600 dark:hover:text-primary-400 active:scale-95"
                    >
                        <Download size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <SummaryCard title="Work Time" value={stats.summary?.workTime || '00:00'} trend="" subValue={role === 'ADMIN' ? `${stats.employees?.length || 0} employees tracked` : 'Personal activity'} icon={Clock} />
                <SummaryCard title="Active Time" value={stats.summary?.activeTime || '00:00'} trend="" subValue="Computer activity" icon={Activity} />
                <SummaryCard title="Idle Time" value={stats.summary?.idleTime || '00:00'} trend="" subValue="Keyboard/mouse inactive" icon={Clock} />
                <SummaryCard title="Manual Time" value={stats.summary?.manualTime || '00:00'} subValue="User-entered time" icon={Plus} />
                <SummaryCard title="Productive Time" value={stats.summary?.productiveTime || '00:00'} trend="" subValue="High-value work" icon={TrendingUp} />
                <SummaryCard title="Unproductive Time" value={stats.summary?.unproductiveTime || '00:00'} trend="" subValue="Low-value activity" icon={TrendingDown} />
                <SummaryCard title="Neutral Time" value={stats.summary?.neutralTime || '00:00'} trend="" subValue="Mixed activity" icon={ArrowRightLeft} />
                <SummaryCard title="Productivity Score" value={`${stats.summary?.utilization ?? 0}%`} subValue={`Work / Productive`} icon={TrendingUp} />
            </div>

            {/* Main Visualizations */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 overflow-hidden">
                <div className="flex items-center gap-6 px-6 pt-6 border-b border-slate-100 dark:border-slate-800">
                    {['Activities', 'Utilization'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveChartTab(tab)}
                            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeChartTab === tab ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            {tab}
                            {activeChartTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary-600 rounded-full" />}
                        </button>
                    ))}
                </div>
                <div className="h-[400px] w-full p-6 pt-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
                                tickFormatter={(val) => `${val}h`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '30px' }}
                            />
                            <Area type="monotone" name="Active Time" dataKey="active" fill="#6366f1" stroke="#4f46e5" strokeWidth={3} fillOpacity={0.1} />
                            <Area type="monotone" name="Break Time" dataKey="break" fill="#22d3ee" stroke="#06b6d4" strokeWidth={2} fillOpacity={0.05} />
                            <Area type="monotone" name="Idle Time" dataKey="idle" fill="#cbd5e1" stroke="#94a3b8" strokeWidth={2} fillOpacity={0.05} />
                            <Bar name="Manual Time" dataKey="manual" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={20} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
                {role !== 'EMPLOYEE' && (
                    <>
                        <EmployeeTable title="Top Productive Employees" data={employeesProd} type="up" />
                        <EmployeeTable title="Top Unproductive Employees" data={employeesUnprod} type="down" />
                        <EmployeeTable title="Top Productive Teams" data={teamsList} type="up" />
                        <EmployeeTable title="Top Unproductive Teams" data={[...teamsList].sort((a, b) => a.utilization - b.utilization)} type="down" />
                    </>
                )}
            </div>

            {/* Removed unused mock widgets: Analytical Insights & Asset Monitoring */}

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}