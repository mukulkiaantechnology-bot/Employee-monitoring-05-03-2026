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
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
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

export function Dashboard() {
    const { employees: contextEmployees, teams: contextTeams, stats, isLoading, addEmployee } = useRealTime();
    const { role } = useAuthStore();
    const [activeChartTab, setActiveChartTab] = useState('Activities');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleDownload = () => {
        const empMetricsData = stats.empMetrics || [];
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

    const chartData = stats.intradayActivity?.length
        ? stats.intradayActivity
        : [
            { name: '08:00', active: 0, break: 0, manual: 0, idle: 0 },
            { name: '12:00', active: 0, break: 0, manual: 0, idle: 0 },
            { name: '18:00', active: 0, break: 0, manual: 0, idle: 0 },
        ];

    const pieData = [
        { name: 'AI tools', value: 35, color: '#6366f1' },
        { name: 'Uncategorized', value: 25, color: '#94a3b8' },
        { name: 'Collaborative software', value: 20, color: '#22c55e' },
        { name: 'Search engine', value: 15, color: '#f59e0b' },
        { name: 'Services', value: 5, color: '#a855f7' },
        { name: 'Other', value: 10, color: '#e2e8f0' },
    ];

    // Use analytics engine output from context
    const employeesProd = stats.topProductive || [];
    const employeesUnprod = stats.topUnproductive || [];
    const teams = (stats.departmentStats || []).map(dept => ({
        initials: dept.name.substring(0, 2).toUpperCase(),
        name: dept.name,
        team: '',
        productive: `${dept.productivity}%`,
        unproductive: `${100 - dept.productivity}%`,
        utilization: dept.productivity,
    }));

    const appUsage = stats.appUsage || [];
    const categories = appUsage.slice(0, 5).map(a => ({
        name: a.app,
        time: a.timeStr,
        trend: a.category === 'productive' ? '+8.5%' : '-3.2%',
    }));
    const pieData2 = appUsage.slice(0, 6).map((a, i) => ({
        name: a.app,
        value: Math.round(a.minutes / Math.max(1, appUsage.reduce((s, x) => s + x.minutes, 0)) * 100),
        color: ['#6366f1', '#94a3b8', '#22c55e', '#f59e0b', '#a855f7', '#e2e8f0'][i]
    }));

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Productivity Trends</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-lg shadow-primary-200 dark:shadow-none uppercase tracking-wider"
                    >
                        Add New Employee
                    </button> */}
                    {role !== 'EMPLOYEE' && (
                        <div className="relative">
                            <button
                                onClick={() => navigate(`/${role.toLowerCase()}/employees`)}
                                title="View All Employees"
                                className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-all active:scale-95"
                            >
                                <Users size={18} />
                            </button>
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#fcfdfe] dark:border-slate-950 pointer-events-none">{contextEmployees.length || 2}</span>
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

            {/* Summary Metrics — computed from analytics engine */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <SummaryCard title="Work Time" value={stats.summary?.workTime || stats.totalHours?.today || '00:00'} trend="-3.1%" subValue={`${stats.total || 0} employees tracked`} icon={Clock} />
                <SummaryCard title="Active Time" value={stats.summary?.activeTime || '00:00'} trend="-1.8%" subValue="Computer activity" icon={Activity} />
                <SummaryCard title="Idle Time" value={stats.summary?.idleTime || '00:00'} trend="+2.4%" subValue="Mouse/KB inactive" icon={Clock} />
                <SummaryCard title="Manual Time" value={stats.summary?.manualTime || '00:00'} subValue="User-entered time" icon={Plus} />
                <SummaryCard title="Productive Time" value={stats.summary?.productiveTime || '00:00'} trend="+1.5%" subValue="High-value work" icon={TrendingUp} />
                <SummaryCard title="Unproductive Time" value={stats.summary?.unproductiveTime || '00:00'} trend="-0.5%" subValue="Low-value activity" icon={TrendingDown} />
                <SummaryCard title="Neutral Time" value={stats.summary?.neutralTime || '00:00'} trend="-2.1%" subValue="Mixed activity" icon={ArrowRightLeft} />
                <SummaryCard title="Utilization" value={`${stats.summary?.utilization ?? 0}%`} subValue={`Productivity ${stats.summary?.productivity ?? 0}%`} icon={TrendingUp} />
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
                <EmployeeTable title="Top Productive Employees" data={employeesProd} type="up" />
                <EmployeeTable title="Top Unproductive Employees" data={employeesUnprod} type="down" />
                <EmployeeTable title="Top Productive Teams" data={teams} type="up" />
                <EmployeeTable title="Top Unproductive Teams" data={[...teams].sort((a, b) => a.utilization - b.utilization)} type="down" />
            </div>

            {/* Analytical Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
                <CategoryTable data={categories} />

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Breakdown by Category</h3>
                        <button className="text-[10px] font-black text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 uppercase tracking-widest">Export</button>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10">
                        <div className="h-64 w-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData2.length ? pieData2 : pieData} innerRadius={75} outerRadius={100} paddingAngle={4} dataKey="value" stroke="none">
                                        {(pieData2.length ? pieData2 : pieData).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Today</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-[200px] space-y-4">
                            {(pieData2.length ? pieData2 : pieData).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors uppercase tracking-tight">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-900 dark:text-white">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Asset Monitoring */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <AppSection title="Productive Apps and Websites" />
                <AppSection title="Unproductive Apps and Websites" />
                <AppSection title="Neutral Apps and Websites" />
            </div>

            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}