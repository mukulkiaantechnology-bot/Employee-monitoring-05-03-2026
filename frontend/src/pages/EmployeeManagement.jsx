import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    MapPin,
    Shield,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Globe,
    X,
    Eye,
    EyeOff,
    UserPlus,
    Bell,
    UserCheck,
    Info,
    ShieldCheck,
    Lock,
    Clock
} from 'lucide-react';
import { useRealTime } from '../hooks/RealTimeContext';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { GlobalCalendar } from '../components/GlobalCalendar';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-md" }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="absolute inset-0" onClick={onClose}></div>
            <div
                className={cn(
                    "w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/50 dark:border-slate-800 animate-in zoom-in-95 duration-300 relative z-10",
                    maxWidth
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{title}</h3>
                        {subtitle && <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wide">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
};

// --- New Components for Privacy Controls ---

const TransparencyModal = ({ isOpen, onClose, employee }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Transparency Dashboard"
            subtitle={employee?.name}
            maxWidth="max-w-lg"
        >
            <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tracking Hours</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock size={14} className="text-primary-500" /> 09:00 - 18:00
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Frequency</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" /> Every 5 Min
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monitored Data Types</h4>
                    {[
                        { name: 'Application Tracking', status: 'Enabled', desc: 'Records active window titles and usage duration.' },
                        { name: 'Screenshot Monitoring', status: 'Smart Blur', desc: 'Captures screen every 5-10 mins with sensitive data blurring.' },
                        { name: 'Location Tracking', status: 'Shift Only', desc: 'GPS tracking active only during designated work hours.' },
                        { name: 'Activity Levels', status: 'Enabled', desc: 'Keystroke and mouse movement frequency (no logging).' }
                    ].map((type, i) => (
                        <div key={i} className="group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900/40 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-black text-slate-800 dark:text-slate-200">{type.name}</span>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 uppercase tracking-tighter">
                                    {type.status}
                                </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400 leading-tight">{type.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/20 flex gap-3 items-start mb-8">
                <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                    Last monitoring activity detected 4 minutes ago. All data is encrypted and subject to the company's Privacy Policy.
                </p>
            </div>

            <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                Dismiss Dashboard
            </button>
        </Modal>
    );
};

const PrivacyControlsPanel = ({ isExpanded, toggleExpand }) => {
    return (
        <div className={cn(
            "rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
            isExpanded
                ? "bg-white dark:bg-slate-900 shadow-2xl border-primary-100 dark:border-primary-900/30 p-8"
                : "bg-slate-50/80 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 p-6"
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isExpanded ? "bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none" : "bg-white dark:bg-slate-800 text-slate-400 shadow-sm"
                    )}>
                        <Lock size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Privacy & Monitoring Controls</h2>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">Enterprise-level data governance & transparency settings</p>
                    </div>
                </div>
                <button
                    onClick={toggleExpand}
                    className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-200 transition-all group"
                >
                    <ChevronDown size={20} className={cn("transition-transform duration-500", isExpanded && "rotate-180")} />
                </button>
            </div>

            {isExpanded && (
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200">Work-Hours Monitoring</p>
                                <p className="text-[11px] font-medium text-slate-400">Auto pause tracking outside shift</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 shadow-inner"></div>
                            </label>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20 flex items-center gap-3">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Globally Enforced</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm font-black text-slate-800 dark:text-slate-200">Sensitive Data Protection</p>
                            <p className="text-[11px] font-medium text-slate-400">Global screenshot privacy mode</p>
                        </div>
                        <div className="relative group">
                            <select className="w-full h-11 pl-4 pr-10 rounded-xl border-2 border-slate-100 bg-slate-50 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-800 dark:text-slate-200 appearance-none focus:border-primary-500 focus:bg-white transition-all cursor-pointer outline-none">
                                <option>Smart Sensitive Blur (Default)</option>
                                <option>Partial Interface Blur</option>
                                <option>Total Content Privacy</option>
                                <option>Disable Screenshotting</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm font-black text-slate-800 dark:text-slate-200">Policy Compliance</p>
                            <p className="text-[11px] font-medium text-slate-400">Require employee acknowledgement</p>
                        </div>
                        <button className="w-full h-11 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md">
                            Broadcast New Policy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const MergeEmployeesModal = ({ isOpen, onClose, employees, onMerge }) => {
    const [fromId, setFromId] = useState('');
    const [intoId, setIntoId] = useState('');
    const [error, setError] = useState('');

    const handleMerge = () => {
        if (!fromId || !intoId) {
            setError('Both employees must be selected');
            return;
        }
        if (fromId === intoId) {
            setError('Cannot select same employee');
            return;
        }
        onMerge(fromId, intoId);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Merge Employees" subtitle="Enterprise Data Consolidation">
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Merge From</label>
                        <select
                            value={fromId}
                            onChange={(e) => setFromId(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold dark:text-slate-200 outline-none focus:border-primary-500 transition-all appearance-none"
                        >
                            <option value="">Select source employee</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Merge Into</label>
                        <select
                            value={intoId}
                            onChange={(e) => setIntoId(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold dark:text-slate-200 outline-none focus:border-primary-500 transition-all appearance-none"
                        >
                            <option value="">Select target employee</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                    </div>
                </div>

                {error && <p className="text-rose-500 text-[10px] font-bold uppercase">{error}</p>}

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                        Merging employees is a one-way action. All data from the source employee will be transferred, and the source will be marked as merged.
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <button onClick={onClose} className="flex-1 py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                    <button onClick={handleMerge} className="flex-1 py-4 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-primary-700 shadow-xl transition-all">Merge Employees</button>
                </div>
            </div>
        </Modal>
    );
};

const NotificationsPanel = ({ isOpen, onClose }) => {
    const notifications = [
        { id: 1, title: 'New Employee Added', time: '2 mins ago', icon: <UserPlus size={16} /> },
        { id: 2, title: 'Merge Request Completed', time: '1 hour ago', icon: <Shield size={16} /> },
        { id: 3, title: 'Agent Offline: Robert Fox', time: '3 hours ago', icon: <Info size={16} /> },
    ];

    if (!isOpen) return null;

    return (
        <div className="absolute top-16 right-0 z-[120] w-80 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Notifications</h4>
                <button onClick={onClose} className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Mark all as read</button>
            </div>
            <div className="space-y-4">
                {notifications.map(n => (
                    <div key={n.id} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                            {n.icon}
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-900 dark:text-white">{n.title}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 border-t border-slate-50 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">View All Activity</button>
        </div>
    );
};

const EmployeeActionsDrawer = ({ isOpen, onClose, employee, onUpdateStatus }) => {
    if (!isOpen || !employee) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-slate-950 h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Quick Actions</h3>
                        <button onClick={onClose} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                            <img src={employee.avatar} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{employee.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={cn(
                                    "h-2 w-2 rounded-full",
                                    employee.status === 'active' ? "bg-emerald-500" : "bg-slate-400"
                                )}></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{employee.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Manage Status</h5>
                        <div className="grid grid-cols-1 gap-3">
                            {employee.status === 'deactivated' ? (
                                <button
                                    onClick={() => onUpdateStatus(employee.id, 'active')}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            <UserCheck size={20} />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-tight">Reactivate Employee</span>
                                    </div>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => onUpdateStatus(employee.id, 'deactivated')}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-700 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                            <EyeOff size={20} />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-tight">Deactivate Monitoring</span>
                                    </div>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}

                            <button
                                onClick={() => { /* Placeholder for real app */ }}
                                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <Shield size={20} />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-tight">Reset Private Data</span>
                                </div>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Employee Info</h5>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{employee.team}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{employee.location}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{employee.role || 'Employee'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Close Actions
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const AdvancedCalendar = ({ isOpen, onClose, selectedPreset, onSelectPreset, triggerRef }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date()); // For navigation
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const calendarRef = useRef(null);

    useLayoutEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const calendarWidth = 540;
            const calendarHeight = 440; // Approximate

            let top = rect.bottom + window.scrollY + 12; // Increased from 8 to 12
            let left = rect.left + window.scrollX;

            // Prevent horizontal overflow
            if (left + calendarWidth > window.innerWidth) {
                left = window.innerWidth - calendarWidth - 20;
            }
            if (left < 20) left = 20;

            setCoords({ top, left });
        }
    }, [isOpen, triggerRef]);

    if (!isOpen) return null;

    const presets = [
        'Today', 'Yesterday', 'This Week', 'Last 7 Days',
        'Previous Week', 'This Month', 'Previous Month',
        'Last 3 Months', 'Last 6 Months'
    ];

    // Helper to get days for the current month view
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Add empty slots for days before the 1st
        for (let i = 0; i < firstDay; i++) days.push(null);
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) days.push(i);

        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('default', { month: 'short' });
    const year = currentMonth.getFullYear();

    const calendarContent = (
        <div
            ref={calendarRef}
            style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                position: 'absolute'
            }}
            className="z-[9999] w-[540px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 dark:border-slate-800/50 flex overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
            {/* Left side: Calendar */}
            <div className="flex-1 p-8 border-r border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calendar</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <Globe size={12} className="text-primary-600" />
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Employees' Time Zone</span>
                            <ChevronDown size={12} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{monthName} {year}</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-2 text-center mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-[10px] font-black text-slate-300 uppercase">{d}</div>
                    ))}
                    {days.map((day, i) => (
                        <div key={i} className="flex items-center justify-center h-10">
                            {day && (
                                <button
                                    className={cn(
                                        "h-8 w-8 rounded-full text-[11px] font-bold transition-all",
                                        day === 27 && monthName === 'Feb' ? "bg-primary-600 text-white shadow-lg shadow-primary-200 font-black" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    {day}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
                    <button onClick={onClose} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                    <button onClick={onClose} className="px-8 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-100 dark:shadow-none transition-all">Apply</button>
                </div>
            </div>

            {/* Right side: Presets */}
            <div className="w-52 bg-slate-50/50 dark:bg-slate-800/30 p-8 flex flex-col gap-1 overflow-y-auto max-h-[500px] scrollbar-thin">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Preset Filters</h4>
                {presets.map(preset => (
                    <button
                        key={preset}
                        onClick={() => { onSelectPreset(preset); onClose(); }}
                        className={cn(
                            "w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all",
                            selectedPreset === preset ? "bg-primary-100/50 text-primary-600 font-black" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        {preset}
                    </button>
                ))}
            </div>
        </div>
    );

    return createPortal(calendarContent, document.body);
};

const EmployeeRow = ({ employee, onSelect, onTransparencyClick, visibleColumns }) => {
    const statusColor =
        employee.status === 'active' || employee.status === 'online' ? 'bg-emerald-500' :
            employee.status === 'pending' ? 'bg-amber-500' :
                employee.status === 'idle' ? 'bg-amber-400' :
                    employee.status === 'offline' ? 'bg-slate-400' :
                        employee.status === 'deactivated' ? 'bg-rose-500' :
                            employee.status === 'merged' ? 'bg-purple-500' : 'bg-slate-300';

    return (
        <>
            {/* ── MOBILE CARD (hidden on md+) ── */}
            <tr className="md:hidden border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="p-4" colSpan={99}>
                    <div
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform cursor-pointer"
                        onClick={() => onSelect(employee)}
                    >
                        {/* Header row: avatar + name + status */}
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 rounded-2xl border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                                <img src={employee.avatar} className="h-full w-full object-cover" alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{employee.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{employee.email}</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0">
                                <div className={cn("h-2 w-2 rounded-full ring-1 ring-white dark:ring-slate-900", statusColor)} />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{employee.status}</span>
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {visibleColumns.includes('Team') && (
                                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Team</span>
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate">{employee.team}</span>
                                </div>
                            )}
                            {visibleColumns.includes('Location') && (
                                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Location</span>
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate">{employee.location || '—'}</span>
                                </div>
                            )}
                            {visibleColumns.includes('Work Time') && (
                                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Work</span>
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">0h 00m</span>
                                </div>
                            )}
                            {visibleColumns.includes('Manual Time') && (
                                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Manual</span>
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">0h 00m</span>
                                </div>
                            )}
                            {visibleColumns.includes('Computer Act.') && (
                                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 flex flex-col gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Computer</span>
                                    <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">0h 00m</span>
                                </div>
                            )}
                        </div>

                        {/* Action button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onTransparencyClick(employee); }}
                            className="w-full py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 hover:border-primary-100 transition-all flex items-center justify-center gap-2"
                        >
                            <Eye size={14} /> Privacy Dashboard
                        </button>
                    </div>
                </td>
            </tr>

            {/* ── DESKTOP TABLE ROW (hidden below md) ── */}
            <tr
                className="hidden md:table-row group hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 border-b border-slate-50 dark:border-slate-800 last:border-0"
                onClick={() => onSelect(employee)}
            >
                {visibleColumns.includes('User') && (
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-2xl border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                                <img src={employee.avatar} className="h-full w-full object-cover" alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">{employee.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{employee.email}</p>
                            </div>
                        </div>
                    </td>
                )}
                {visibleColumns.includes('Team') && (
                    <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                            {employee.team}
                        </span>
                    </td>
                )}
                {visibleColumns.includes('Location') && (
                    <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{employee.location}</span>
                    </td>
                )}
                {visibleColumns.includes('Work Time') && (
                    <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">0h 00m</span>
                    </td>
                )}
                {visibleColumns.includes('Manual Time') && (
                    <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">0h 00m</span>
                    </td>
                )}
                {visibleColumns.includes('Computer Act.') && (
                    <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">0h 00m</span>
                    </td>
                )}
                <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <div className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900", statusColor)} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{employee.status}</span>
                    </div>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onTransparencyClick(employee); }}
                            className="h-9 w-9 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-100 dark:hover:border-primary-900/50 transition-all group/btn"
                            title="View Transparency"
                        >
                            <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onSelect(employee); }}
                            className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 hidden md:flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </td>
            </tr>
        </>
    );
};

export function EmployeeManagement() {
    const { employees, teams, addEmployee, deleteEmployee, updateEmployee, mergeEmployees } = useRealTime();

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [transparencyEmployee, setTransparencyEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // All, online, idle, offline
    const [showAddModal, setShowAddModal] = useState(false);
    const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);

    // --- New State for Enterprise Features ---
    const [activeTab, setActiveTab] = useState('Active'); // Active, Pending, Deactivated, Merged
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState('Yesterday');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState([
        'User', 'Team', 'Location', 'Work Time', 'Manual Time', 'Computer Act.',
        'Productive', 'Unproductive', 'Neutral', 'Idle', 'Break', 'Utilization',
        'Agent Version', 'Created'
    ]);
    const [showMergeModal, setShowMergeModal] = useState(false);
    const [showColumnDropdown, setShowColumnDropdown] = useState(false);
    const [mergeFrom, setMergeFrom] = useState('');
    const [mergeInto, setMergeInto] = useState('');
    const [addEmployeeStep, setAddEmployeeStep] = useState(1);
    const [computerType, setComputerType] = useState(null);
    const [invitations, setInvitations] = useState([{ email: '', name: '', team: 'Engineering' }]);
    const [currentPage, setCurrentPage] = useState(1);
    const calendarTriggerRef = useRef(null);

    const [itemsPerPage, setItemsPerPage] = useState(8);

    const filteredEmployees = employees.filter(emp => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = (emp.name?.toLowerCase() ?? '').includes(q) ||
            (emp.team?.toLowerCase() ?? '').includes(q) ||
            (emp.email?.toLowerCase() ?? '').includes(q);
        const matchesTab = activeTab === 'Active' ? ['active', 'idle', 'offline'].includes(emp.status) :
            activeTab === 'Pending' ? emp.status === 'pending' :
                activeTab === 'Deactivated' ? emp.status === 'deactivated' :
                    emp.status === 'merged';
        return matchesSearch && matchesTab;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

    const handleAddEmployee = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newEmp = {
            name: formData.get('name'),
            role: formData.get('role'),
            team: formData.get('team') || 'Engineering',
            email: `${formData.get('name').toLowerCase().replace(/\s+/g, '.')}@shoppeal.tech`,
            location: 'Remote',
            status: 'active'
        };
        addEmployee(newEmp);
        setShowAddModal(false);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to deactivate this employee?')) {
            deleteEmployee(id);
            setSelectedEmployee(null);
        }
    };

    return (
        <div className="relative space-y-6 pb-20 max-w-full overflow-x-hidden box-border px-4 md:px-0">
            {/* Transparency Modal */}
            <TransparencyModal
                isOpen={!!transparencyEmployee}
                onClose={() => setTransparencyEmployee(null)}
                employee={transparencyEmployee}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    {/* <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
                        <UserCheck size={24} />
                    </div> */}
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Employees</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowMergeModal(true)}
                        className="h-11 px-6 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-600 hover:border-primary-100 transition-all"
                    >
                        Merge Employees
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-primary-700 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} /> Add New Employee
                    </button>
                </div>
            </div>

            {/* Privacy Controls Section */}
            <PrivacyControlsPanel
                isExpanded={isPrivacyExpanded}
                toggleExpand={() => setIsPrivacyExpanded(!isPrivacyExpanded)}
            />

            <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 shadow-xl overflow-hidden">
                <div className="px-6 md:px-8 pt-6 overflow-x-auto">
                    <div className="flex items-center gap-8 border-b border-slate-100 dark:border-slate-800 min-w-max">
                        {['Active', 'Pending', 'Deactivated', 'Merged'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "pb-4 text-xs font-black uppercase tracking-widest transition-all relative",
                                    activeTab === tab
                                        ? "text-primary-600 dark:text-primary-400"
                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 animate-in fade-in duration-300" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                    {/* Filter bar — stacks vertically on mobile, side-by-side on desktop */}
                    <div className="flex flex-wrap items-center gap-3">
                        <GlobalCalendar />

                        <div className="relative flex-1 min-w-[160px] group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pl-9 pr-4 py-2.5 text-xs font-bold dark:text-slate-200 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Action buttons always at the end */}
                        <div className="flex items-center gap-2 ml-auto">
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
                                <Filter size={18} />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                                >
                                    <ChevronRight size={18} className="rotate-90" />
                                </button>

                                {showColumnDropdown && (
                                    <div className="absolute top-full right-0 mt-2 z-[110] w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Visible Columns</h4>
                                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                                            {[
                                                'Identifier', 'Alias ID', 'User', 'Team', 'Location', 'Work Time',
                                                'Manual Time', 'Computer Act.', 'Productive', 'Unproductive',
                                                'Neutral', 'Idle', 'Break', 'Utilization', 'Agent Version', 'Created'
                                            ].map(col => (
                                                <label key={col} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={visibleColumns.includes(col)}
                                                            onChange={() => {
                                                                setVisibleColumns(prev =>
                                                                    prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
                                                                )
                                                            }}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="h-5 w-5 rounded-md border-2 border-slate-200 dark:border-slate-700 peer-checked:bg-primary-600 peer-checked:border-primary-600 dark:peer-checked:border-primary-600 transition-all" />
                                                        <ShieldCheck size={12} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all">{col}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="hidden md:table-header-group">
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                {visibleColumns.includes('User') && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</th>}
                                {visibleColumns.includes('Team') && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Team</th>}
                                {visibleColumns.includes('Location') && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>}
                                {visibleColumns.includes('Work Time') && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Work Time [h]</th>}
                                {visibleColumns.includes('Manual Time') && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Manual Time [h]</th>}
                                {visibleColumns.includes('Computer Act.') && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Computer Act. [h]</th>}
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 uppercase tracking-wider text-slate-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-transparent md:divide-slate-50 dark:md:divide-slate-800/50">
                            {paginatedEmployees.map((emp) => (
                                <EmployeeRow
                                    key={emp.id}
                                    employee={emp}
                                    onSelect={setSelectedEmployee}
                                    onTransparencyClick={setTransparencyEmployee}
                                    visibleColumns={visibleColumns}
                                />
                            ))}
                            {filteredEmployees.length === 0 && (
                                <tr className="block md:table-row">
                                    <td colSpan="5" className="px-6 py-20 text-center block md:table-cell">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">No employees found</p>
                                            <p className="text-sm font-medium text-slate-500">Try adjusting your filters or search terms</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-8 py-6 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Showing <span className="text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, filteredEmployees.length)}</span> of <span className="text-slate-900 dark:text-white">{filteredEmployees.length}</span> members
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-primary-500 hover:text-primary-600 disabled:opacity-50 disabled:hover:border-slate-200 transition-all flex items-center gap-2"
                            >
                                <ChevronRight size={14} className="rotate-180" /> Previous
                            </button>

                            <div className="flex items-center gap-1 mx-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={cn(
                                            "h-9 w-9 rounded-xl text-[10px] font-black transition-all",
                                            currentPage === i + 1
                                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg"
                                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-primary-500 hover:text-primary-600 disabled:opacity-50 disabled:hover:border-slate-200 transition-all flex items-center gap-2"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Multi-step Add Employee Modal */}
            <AddEmployeeModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
            />

            {/* Merge Employees Modal */}
            <MergeEmployeesModal
                isOpen={showMergeModal}
                onClose={() => setShowMergeModal(false)}
                employees={employees}
                onMerge={(from, into) => {
                    mergeEmployees(from, into);
                    setActiveTab('Merged');
                }}
            />
            {/* Employee Actions Drawer */}
            <EmployeeActionsDrawer
                isOpen={!!selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
                employee={selectedEmployee}
                onUpdateStatus={(id, status) => {
                    updateEmployee(id, { status });
                    setSelectedEmployee(null);
                }}
            />
        </div >
    );
}
