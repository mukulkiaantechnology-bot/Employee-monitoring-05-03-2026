import {
    DollarSign,
    FileText,
    Globe,
    UserCheck,
    Download,
    Clock,
    CheckCircle2,
    Timer,
    TrendingUp,
    CreditCard,
    Plus,
    MoreHorizontal,
    X,
    Receipt,
    Building2,
    Search,
    ChevronLeft,
    ChevronRight,
    Send,
    ChevronDown,
    MessageCircle,
    ShieldCheck,
    Link2,
    Loader2,
    Zap
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import usePayrollStore from '../store/payrollStore';
import { FilterDropdown } from '../components/FilterDropdown';
import { GlobalCalendar } from '../components/GlobalCalendar';
import { useFilterStore } from '../store/filterStore';
import { useRealTime } from '../hooks/RealTimeContext';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const INTEGRATIONS = [
    { id: 'quickbooks', name: 'QuickBooks', desc: 'Sync payroll & expenses with your QuickBooks ledger.', icon: Building2, color: 'text-emerald-500 bg-emerald-500', glow: 'shadow-emerald-500/20' },
    { id: 'xero', name: 'Xero', desc: 'Automated data sync for cloud-based accounting.', icon: Globe, color: 'text-blue-400 bg-blue-400', glow: 'shadow-blue-400/20' },
    { id: 'paychex', name: 'Paychex', desc: 'Manage HR, payroll, and benefits in one place.', icon: CreditCard, color: 'text-indigo-600 bg-indigo-600', glow: 'shadow-indigo-600/20' }
];

const IntegrationCard = ({ item, status, onConnect }) => {
    const isConnected = status === 'Connected';

    return (
        <div className="group relative overflow-hidden rounded-[2rem] md:rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className={cn("absolute top-0 right-0 h-32 w-32 blur-3xl opacity-5 rounded-full -mr-10 -mt-10", item.color)} />

            <div className="flex items-start justify-between mb-6 md:mb-8 relative z-10">
                <div className={cn("h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-[1.25rem] flex items-center justify-center text-white shadow-lg", item.color)}>
                    <item.icon size={28} className="md:w-[32px] md:h-[32px]" />
                </div>
                <span className={cn(
                    "px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-colors",
                    isConnected
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800"
                        : "bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                )}>
                    {status}
                </span>
            </div>

            <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{item.name}</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium mb-6 md:mb-8 leading-relaxed h-auto md:h-10 truncate-2-lines">{item.desc}</p>

                <button
                    onClick={() => !isConnected && onConnect(item.id)}
                    className={cn(
                        "w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                        isConnected
                            ? "bg-slate-50 text-slate-400 cursor-default dark:bg-slate-800"
                            : "bg-slate-900 text-white hover:scale-[1.02] active:scale-95 shadow-xl dark:bg-white dark:text-slate-900"
                    )}
                >
                    {isConnected ? (
                        <><ShieldCheck size={14} className="md:w-[16px] md:h-[16px]" /> Sync Active</>
                    ) : (
                        <><Link2 size={14} className="md:w-[16px] md:h-[16px]" /> Connect Now</>
                    )}
                </button>
            </div>
        </div>
    );
};

const OAuthModal = ({ service, step, onClose }) => {
    if (!service) return null;
    const item = INTEGRATIONS.find(i => i.id === service);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300 text-center">
                {step === 'connecting' ? (
                    <div className="py-6">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
                            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <item.icon size={32} className="text-indigo-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black mb-2 tracking-tight">Connecting {item.name}</h3>
                        <p className="text-slate-500 font-medium tracking-tight">Please wait while we establish a secure OAuth 2.0 connection...</p>
                    </div>
                ) : (
                    <div className="py-6 animate-in zoom-in-50 duration-500">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black mb-2 tracking-tight">Success!</h3>
                        <p className="text-slate-500 font-medium tracking-tight mb-10">Your {item.name} account is now linked and healthy.</p>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all dark:bg-white dark:text-slate-900"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, subValue, icon: Icon, color, trend }) => (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md group">
        <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", color)}>
                <Icon size={22} />
            </div>
            <div className={cn("text-xs font-bold px-2 py-1 rounded-lg", trend >= 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20")}>
                {trend >= 0 ? '+' : ''}{trend}%
            </div>
        </div>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
        <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">{value}</p>
        <p className="mt-1 text-xs font-bold text-slate-400 truncate">{subValue}</p>
    </div>
);

// Mock Data for Charts (Restored)
const earningsData = [
    { month: 'Jan', earnings: 45000, hours: 1200 },
    { month: 'Feb', earnings: 48000, hours: 1250 },
    { month: 'Mar', earnings: 42000, hours: 1100 },
    { month: 'Apr', earnings: 52000, hours: 1350 },
    { month: 'May', earnings: 50000, hours: 1300 },
    { month: 'Jun', earnings: 55000, hours: 1400 },
];

export function Payroll() {
    const { employees, addNotification } = useRealTime();
    const { 
        summary, 
        records: payrollTimesheets, 
        invoices: storeInvoices, 
        fetchSummary, 
        fetchRecords, 
        fetchInvoices,
        createInvoice,
        loading 
    } = usePayrollStore();

    const { dateRange, selectedEmployee, selectedTeam } = useFilterStore();

    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [activeTab, setActiveTab] = useState('payroll'); // payroll, invoices
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [integrationStatuses, setIntegrationStatuses] = useState({
        quickbooks: 'Not Connected',
        xero: 'Not Connected',
        paychex: 'Not Connected'
    });
    const [connectingService, setConnectingService] = useState(null);
    const [connectionStep, setConnectionStep] = useState('idle');

    useEffect(() => {
        const params = {
            startDate: dateRange.start,
            endDate: dateRange.end,
            userId: selectedEmployee,
            teamId: selectedTeam
        };
        fetchSummary(params);
        fetchRecords(params);
    }, [fetchSummary, fetchRecords, dateRange, selectedEmployee, selectedTeam]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [newInvoice, setNewInvoice] = useState({
        clientName: '',
        clientEmail: '',
        amount: '',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        notes: ''
    });

    const handleCreateInvoice = async () => {
        if (!newInvoice.clientName || !newInvoice.amount) {
            addNotification("Client name and amount are required", "alert");
            return;
        }

        const res = await createInvoice({
            ...newInvoice,
            amount: parseFloat(newInvoice.amount)
        });
        if (res.success) {
            setIsInvoiceModalOpen(false);
            setNewInvoice({
                clientName: '',
                clientEmail: '',
                amount: '',
                dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
                notes: ''
            });
            addNotification("Invoice created successfully", "success");
        } else {
            addNotification(res.error || "Failed to create invoice", "alert");
        }
    };

    const handleIntegrationFinish = () => {
        setConnectingService(null);
        setConnectionStep('idle');
    };

    const handleConnectTrigger = (id) => {
        setConnectingService(id);
        setConnectionStep('connecting');
        setTimeout(() => {
            setConnectionStep('success');
            setIntegrationStatuses(prev => ({ ...prev, [id]: 'Connected' }));
            addNotification(`${id.charAt(0).toUpperCase() + id.slice(1)} connected successfully!`, "success");
        }, 2500);
    };

    const filteredPayroll = useMemo(() => {
        return payrollTimesheets.filter(row =>
            row.employee.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [payrollTimesheets, searchQuery]);

    const totalPages = Math.ceil(filteredPayroll.length / itemsPerPage);
    const paginatedPayroll = filteredPayroll.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // --- Financial Actions ---
    const [isRunningPayroll, setIsRunningPayroll] = useState(false);

    const handleRunPayroll = () => {
        setIsRunningPayroll(true);
        addNotification("Initializing payroll batch processing...", "info");

        setTimeout(() => {
            setIsRunningPayroll(false);
            addNotification(`Successfully processed payroll for ${employees.length} employees ($142,500).`, "success");
        }, 2000);
    };

    const handleDownloadReports = () => {
        const headers = ['Employee', 'Role', 'Period', 'Total Hours', 'Overtime', 'Gross Pay', 'Status'];
        const rows = payrollTimesheets.map(p => [
            p.employee,
            p.role,
            p.period || 'Current',
            `${p.totalHours}h`,
            `${p.overTime || 0}h`,
            typeof p.grossPay === 'string' ? p.grossPay.replace('$', '').replace(',', '') : p.grossPay,
            p.status
        ]);

        const content = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `payroll_consolidated_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addNotification("Payroll report downloaded successfully.", "success");
    };

    const handleDownloadIndividualPayslip = (payslip) => {
        const headers = ['Field', 'Details'];
        const rows = [
            ['Employee', payslip.employee],
            ['Role', payslip.role],
            ['Period', payslip.period || 'Current'],
            ['Total Hours', `${payslip.totalHours}h`],
            ['Overtime', `${payslip.overTime || 0}h`],
            ['Gross Pay', typeof payslip.grossPay === 'string' ? payslip.grossPay : `$${payslip.grossPay?.toLocaleString()}`],
            ['Deductions', payslip.deductions ? `-$${payslip.deductions.toLocaleString()}` : '-$0'],
            ['Net Payable', payslip.netPay ? `$${payslip.netPay.toLocaleString()}` : (typeof payslip.grossPay === 'string' ? payslip.grossPay : `$${payslip.grossPay?.toLocaleString()}`)],
            ['Status', payslip.status]
        ];

        const content = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `payslip_${payslip.employee.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addNotification(`Payslip for ${payslip.employee} downloaded.`, "success");
    };

    // Calculate Stats
    const stats = useMemo(() => {
        if (summary) {
            return {
                totalPayroll: `$${Math.round(summary.totalPayroll).toLocaleString()}`,
                avgHourly: `$${Math.round(summary.avgHourlyRate * 10) / 10}`,
                outstanding: `$${storeInvoices.filter(i => i.status !== 'PAID').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}`,
                profit: `$${Math.round(summary.totalPayroll * 0.6).toLocaleString()}`
            };
        }

        const totalGross = payrollTimesheets.reduce((acc, p) => acc + (parseFloat(p.grossPayValue || p.grossPay) || 0), 0);
        const totalHours = payrollTimesheets.reduce((acc, p) => acc + (parseFloat(p.totalHours) || 0), 0);
        const avgRate = totalHours > 0 ? totalGross / totalHours : 0;
        const totalOutstanding = storeInvoices.filter(i => i.status !== 'PAID').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0);
        const totalProfit = totalGross * 0.6; // Simple 60% markup simulation

        return {
            totalPayroll: `$${Math.round(totalGross || 0).toLocaleString()}`,
            avgHourly: `$${Math.round((avgRate || 0) * 10) / 10}`,
            outstanding: `$${Math.round(totalOutstanding || 0).toLocaleString()}`,
            profit: `$${Math.round(totalProfit || 0).toLocaleString()}`
        };
    }, [payrollTimesheets, storeInvoices, summary]);

    return (
        <div className="space-y-6 pb-20 max-w-full overflow-x-hidden box-border px-4 md:px-0">
            {/* Header */}
            <div className="relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in mb-6 md:mb-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Financials</h1>
                        <span className="hidden xs:inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] md:text-xs font-bold border border-emerald-200">System Healthy</span>
                    </div>
                    <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-medium">Payroll processing & invoice management.</p>
                </div>
                <div className="flex flex-wrap xs:flex-nowrap gap-1 p-1 md:p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full md:w-auto">
                    <GlobalCalendar />
                    <button
                        onClick={() => setActiveTab('payroll')}
                        className={cn("flex-1 md:flex-none px-3 md:px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2", activeTab === 'payroll' ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white")}
                    >
                        <DollarSign size={14} className="md:w-[16px] md:h-[16px]" /> <span className="hidden xs:inline">Payroll</span><span className="xs:hidden">Pay</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={cn("flex-1 md:flex-none px-3 md:px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2", activeTab === 'invoices' ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white")}
                    >
                        <FileText size={14} className="md:w-[16px] md:h-[16px]" /> <span className="hidden xs:inline">Invoices</span><span className="xs:hidden">Inv</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('integrations')}
                        className={cn("flex-1 md:flex-none px-3 md:px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2", activeTab === 'integrations' ? "bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white")}
                    >
                        <Zap size={14} className="md:w-[16px] md:h-[16px]" /> <span className="hidden xs:inline">Connect</span><span className="xs:hidden">Sync</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
                <StatCard title="Total Payroll" value={stats.totalPayroll} subValue="Next run: Feb 28" trend={summary?.trend || 5.2} icon={DollarSign} color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" />
                <StatCard title="Avg Hourly Rate" value={stats.avgHourly} subValue={`Across ${employees.length} Staff`} trend={summary?.avgRateTrend || 1.2} icon={Clock} color="bg-blue-50 text-blue-600 dark:bg-blue-900/20" />
                <StatCard title="Outstanding Invoices" value={stats.outstanding} subValue={`${storeInvoices.filter(i => i.status !== 'PAID').length} Clients Pending`} trend={-8} icon={Receipt} color="bg-amber-50 text-amber-600 dark:bg-amber-900/20" />
                <StatCard title="Net Profit est." value={stats.profit} subValue="Based on 60% Margin" trend={12} icon={TrendingUp} color="bg-purple-50 text-purple-600 dark:bg-purple-900/20" />
            </div>

            {/* Main Content Area */}
            {activeTab === 'payroll' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    {/* Charts & Graphs */}
                    <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                            <h3 className="text-lg font-bold mb-6">Payroll Cost vs Hours</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={earningsData}>
                                        <defs>
                                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" name="Cost ($)" />
                                        <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" name="Hours" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-center">
                            <div className="text-center mb-6 md:mb-8">
                                <div className="inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 animate-bounce">
                                    <CheckCircle2 size={32} className="md:w-[40px] md:h-[40px]" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Ready for Processing</h3>
                                <p className="text-xs md:text-sm text-slate-500 max-w-xs mx-auto mt-2">All timesheets for the current period have been reviewed and approved.</p>
                            </div>
                            <div className="flex flex-col xs:flex-row gap-3 md:gap-4">
                                <button
                                    onClick={handleRunPayroll}
                                    disabled={isRunningPayroll}
                                    className="flex-1 py-3.5 md:py-4 rounded-xl bg-slate-900 text-white font-bold text-xs md:text-sm shadow-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isRunningPayroll ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" />
                                    )}
                                    Run Payroll
                                </button>
                                <button
                                    onClick={handleDownloadReports}
                                    className="flex-1 py-3.5 md:py-4 rounded-xl border-2 border-slate-100 hover:border-slate-300 text-slate-600 font-bold text-xs md:text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Download size={16} className="md:w-[18px] md:h-[18px]" /> Reports
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Employee Payroll List */}
                    <div className="lg:col-span-3 rounded-[2rem] border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h3 className="text-base md:text-lg font-bold">Employee Timesheets & Payslips</h3>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by employee..."
                                    className="w-full h-11 md:h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/50 focus:border-indigo-500 focus:outline-none font-bold text-[11px] md:text-xs"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                            <FilterDropdown />
                        </div>
                        <div className="overflow-x-hidden md:overflow-x-auto">
                            <table className="w-full text-left block md:table">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 hidden md:table-header-group">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Employee</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Period</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Hours</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Gross Pay</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                                        <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 block md:table-row-group">
                                    {paginatedPayroll.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group flex flex-col md:table-row p-4 md:p-0">
                                            <td className="px-0 py-2 md:px-6 md:py-4 block md:table-cell">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 md:h-8 md:w-8 rounded-full bg-slate-100 overflow-hidden ring-2 ring-white dark:ring-slate-800">
                                        <img src={row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.employee)}&background=random`} alt={row.employee} className="w-full h-full object-cover" />
                                    </div>
                                                    <div>
                                                        <p className="text-sm md:text-sm font-black md:font-bold text-slate-900 dark:text-white leading-tight">{row.employee}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{row.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-0 py-1.5 md:px-6 md:py-4 text-[11px] md:text-sm font-bold text-slate-400 md:text-slate-500 block md:table-cell">
                                                <span className="md:hidden opacity-50 uppercase mr-2 text-[9px]">Period:</span>
                                                {row.period || 'Current'}
                                            </td>
                                            <td className="px-0 py-1.5 md:px-6 md:py-4 block md:table-cell">
                                                <div className="flex items-center md:block gap-2">
                                                    <span className="md:hidden opacity-50 uppercase text-[9px] font-bold">Hours:</span>
                                                    <div className="text-sm font-black md:font-bold">{row.totalHours}h</div>
                                                    {row.overTime > 0 && <div className="text-[10px] text-amber-500 font-black uppercase md:tracking-tighter">{row.overTime}h OT</div>}
                                                </div>
                                            </td>
                                             <td className="px-0 py-1.5 md:px-6 md:py-4 text-sm font-black md:font-bold text-slate-900 dark:text-slate-300 block md:table-cell">
                                                <span className="md:hidden opacity-50 uppercase mr-2 text-[9px] font-bold">Gross:</span>
                                                ${(row.grossPay || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-0 py-2 md:px-6 md:py-4 block md:table-cell">
                                                <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 md:px-2.5 md:py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest md:tracking-wide", row.status === 'Ready'
                                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
                                                    : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"
                                                )}>
                                                    {row.status === 'Ready' ? <CheckCircle2 size={12} /> : <Timer size={12} />}
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-0 py-3 md:px-6 md:py-4 text-right block md:table-cell">
                                                <button
                                                    onClick={() => setSelectedPayslip(row)}
                                                    className="w-full md:w-auto px-4 py-2.5 md:px-3 md:py-1.5 rounded-xl md:rounded-lg bg-slate-900 md:bg-slate-100 text-white md:text-slate-600 text-[10px] md:text-xs font-black md:font-bold hover:bg-primary-600 md:hover:bg-primary-50 hover:text-white md:hover:text-primary-600 transition-all shadow-lg shadow-slate-900/10 md:shadow-none uppercase tracking-widest"
                                                >
                                                    View Slip
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="px-4 md:px-6 py-4 md:py-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 gap-4">
                                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
                                    Showing <span className="text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredPayroll.length)}</span> of <span className="text-slate-900 dark:text-white">{filteredPayroll.length}</span> entries
                                </p>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={cn(
                                                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                                    currentPage === i + 1
                                                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                                                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-white dark:hover:bg-slate-800"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'invoices' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-4 md:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                        <h3 className="text-base md:text-lg font-bold mb-6">Recent Invoices</h3>
                        <div className="space-y-3 md:space-y-4">
                            {storeInvoices.map(inv => (
                                <div key={inv.id} className="flex flex-row items-center justify-between p-3 md:p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 transition-all bg-slate-50/50 dark:bg-slate-800/30 group">
                                    <div className="flex items-center gap-3 md:gap-4 truncate">
                                        <div className="h-10 w-10 md:h-10 md:w-10 shrink-0 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                                            <FileText size={20} />
                                        </div>
                                        <div className="truncate">
                                            <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate">{inv.clientName}</h4>
                                            <p className="text-[10px] md:text-xs text-slate-500 font-medium">#{inv.invoiceNumber || inv.id} • {new Date(inv.issueDate || inv.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className="font-black text-sm md:text-base text-slate-900 dark:text-white">
                                            {typeof inv.amount === 'string' ? inv.amount : `$${inv.amount?.toLocaleString()}`}
                                        </p>
                                        <p className={cn("text-[9px] md:text-[10px] font-bold uppercase tracking-wider",
                                            inv.status === 'PAID' ? "text-emerald-500" :
                                                inv.status === 'PENDING' ? "text-amber-500" :
                                                    inv.status === 'SENT' ? "text-blue-500" : "text-slate-400"
                                        )}>{inv.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setIsInvoiceModalOpen(true)}
                            className="w-full mt-6 py-4 md:py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2 text-xs md:text-sm"
                        >
                            <Plus size={18} /> Create New Invoice
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-[2rem] border border-slate-200 bg-slate-900 text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-indigo-500 rounded-full blur-3xl -mr-10 -mt-10 opacity-30"></div>
                            <h3 className="text-lg md:text-xl font-bold mb-2 relative z-10">Sync Assistant</h3>
                            <p className="text-slate-400 text-[11px] md:text-sm mb-6 relative z-10">Quickly sync your data with cloud accounting services.</p>
                            <div className="space-y-3 relative z-10">
                                <button onClick={() => setActiveTab('integrations')} className="w-full py-3 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                                    <Zap size={16} /> Manage Integrations
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'integrations' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Third-Party Integrations</h2>
                            <p className="text-slate-500 font-medium">Automatic data synchronization with industry-leading platforms.</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800">
                            <ShieldCheck size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Enterprise Encrypted</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {INTEGRATIONS.map(item => (
                            <IntegrationCard
                                key={item.id}
                                item={item}
                                status={integrationStatuses[item.id]}
                                onConnect={handleConnectTrigger}
                            />
                        ))}
                    </div>


                </div>
            )}

            {/* Modals */}
            <OAuthModal
                service={connectingService}
                step={connectionStep}
                onClose={handleIntegrationFinish}
            />

            {/* Create Invoice Modal */}
            {isInvoiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create New Invoice</h3>
                            <button onClick={() => setIsInvoiceModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Client name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter client name"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/50 focus:border-indigo-500 focus:outline-none font-bold text-sm"
                                    value={newInvoice.clientName}
                                    onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Client email (Optional)</label>
                                <input 
                                    type="email" 
                                    placeholder="client@example.com"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/50 focus:border-indigo-500 focus:outline-none font-bold text-sm"
                                    value={newInvoice.clientEmail}
                                    onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Amount</label>
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/50 focus:border-indigo-500 focus:outline-none font-bold text-sm"
                                        value={newInvoice.amount}
                                        onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Due Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/50 focus:border-indigo-500 focus:outline-none font-bold text-sm"
                                        value={newInvoice.dueDate}
                                        onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Notes</label>
                                <textarea 
                                    placeholder="Add any additional details..."
                                    className="w-full h-24 p-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/50 focus:border-indigo-500 focus:outline-none font-bold text-sm resize-none"
                                    value={newInvoice.notes}
                                    onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                                />
                            </div>

                            <button 
                                onClick={handleCreateInvoice}
                                className="w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-xl transition-all active:scale-95 dark:bg-white dark:text-slate-900"
                            >
                                Generate Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payslip Modal */}
            {selectedPayslip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in slide-in-from-bottom-4 duration-300 max-h-[95vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-slate-100 overflow-hidden shrink-0 ring-2 ring-slate-200 dark:ring-slate-700">
                                    <img src={selectedPayslip.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPayslip.employee)}&background=random`} alt={selectedPayslip.employee} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedPayslip.employee}</h3>
                                    <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-tight">{selectedPayslip.role} {selectedPayslip.team ? `• ${selectedPayslip.team}` : ''}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPayslip(null)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Period Info */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pay Period</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{selectedPayslip.period || 'Current Month'}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Hourly Rate</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">${(selectedPayslip.hourlyRate || 0).toLocaleString()}/hr</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Hours</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedPayslip.totalHours}h</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Overtime</p>
                                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{selectedPayslip.overTime || 0}h</p>
                                </div>
                            </div>

                            {/* Earnings Breakdown */}
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">Earnings Breakdown</p>
                                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400">Regular Pay ({selectedPayslip.totalHours}h × ${selectedPayslip.hourlyRate || 0}/hr)</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">${(selectedPayslip.grossPay || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                {selectedPayslip.overTime > 0 && (
                                    <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-xs md:text-sm font-bold text-amber-600">Overtime ({selectedPayslip.overTime}h)</span>
                                        <span className="text-sm font-black text-amber-600">${((selectedPayslip.overTime || 0) * (selectedPayslip.hourlyRate || 0) * 1.5).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 text-red-500">
                                    <span className="text-xs md:text-sm font-black uppercase tracking-tight">Tax Deductions (20%)</span>
                                    <span className="text-sm font-black">-${(selectedPayslip.deductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            {/* Net Pay Banner */}
                            <div className="p-5 md:p-6 rounded-2xl bg-slate-900 text-white flex flex-row justify-between items-center shadow-xl">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Net Payable</p>
                                    <p className="text-2xl md:text-3xl font-black">${(selectedPayslip.netPay || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <button
                                    onClick={() => handleDownloadIndividualPayslip(selectedPayslip)}
                                    className="h-12 w-12 md:h-14 md:w-14 items-center justify-center flex bg-white text-slate-900 rounded-xl md:rounded-2xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
                                >
                                    <Download size={20} className="md:w-[24px] md:h-[24px]" />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => addNotification("Payslip email sent successfully", "success")}
                                    className="py-3.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-[9px] md:text-[10px] active:scale-95"
                                >
                                    <Send size={14} className="text-indigo-500" /> Email Slip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
