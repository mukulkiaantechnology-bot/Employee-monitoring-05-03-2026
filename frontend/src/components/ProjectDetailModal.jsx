import React from 'react';
import { 
    X, 
    Briefcase, 
    Users, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    MoreHorizontal,
    DollarSign,
    Target
} from 'lucide-react';
import { cn } from '../utils/cn';

export function ProjectDetailModal({ isOpen, onClose, project }) {
    if (!isOpen || !project) return null;

    const taskStatusColors = {
        'BACKLOG': 'text-slate-400 bg-slate-50 border-slate-100',
        'TODO': 'text-blue-500 bg-blue-50 border-blue-100',
        'IN_PROGRESS': 'text-amber-500 bg-amber-50 border-amber-100',
        'IN_REVIEW': 'text-purple-500 bg-purple-50 border-purple-100',
        'DONE': 'text-emerald-500 bg-emerald-50 border-emerald-100',
        'CANCELLED': 'text-rose-400 bg-rose-50 border-rose-100'
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-primary-200 dark:shadow-none">
                            {(project.projectName || project.name || 'PR').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                                {project.projectName || project.name}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {project.tasks || 0} Tasks
                                </span>
                                <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {project.assignees || 0} Assignees
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 overflow-y-auto scrollbar-thin flex-1">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Budget</span>
                            <div className="flex items-end gap-1">
                                <span className="text-xl font-black text-slate-900 dark:text-white">${project.totalCosts || 0}</span>
                                <span className="text-[10px] font-bold text-slate-400 mb-0.5">Total</span>
                            </div>
                        </div>
                        <div className="bg-emerald-50/30 dark:bg-emerald-500/5 p-4 rounded-xl border border-emerald-100/50 dark:border-emerald-500/10">
                            <span className="text-[9px] font-black text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest block mb-1">Bill Rate</span>
                            <div className="flex items-end gap-1">
                                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">${project.billRate || 0}</span>
                                <span className="text-[10px] font-bold text-emerald-500/60 mb-0.5">/ hour</span>
                            </div>
                        </div>
                        <div className="bg-primary-50/30 dark:bg-primary-500/5 p-4 rounded-xl border border-primary-100/50 dark:border-primary-500/10">
                            <span className="text-[9px] font-black text-primary-600/70 dark:text-primary-400/70 uppercase tracking-widest block mb-1">Description</span>
                            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {project.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Content Tabs Header */}
                    <div className="flex items-center gap-8 mb-6 border-b border-slate-50 dark:border-slate-800/50">
                        <button className="pb-4 text-[10px] font-black text-primary-600 uppercase tracking-widest relative">
                            Project Tasks
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                        </button>
                    </div>

                    {/* Tasks Table */}
                    <div className="space-y-4">
                        {(project.tasksData || []).length > 0 ? (
                            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Task Name</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Assignee</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Priority</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {(project.tasksData || []).map((task, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{task.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {task.employee ? (
                                                            <>
                                                                <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-primary-100 dark:shadow-none overflow-hidden">
                                                                    {task.employee.avatar ? (
                                                                        <img src={task.employee.avatar} alt="" className="h-full w-full object-cover" />
                                                                    ) : (
                                                                        task.employee.fullName?.substring(0, 2).toUpperCase()
                                                                    )}
                                                                </div>
                                                                <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400">{task.employee.fullName}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-[11px] font-bold text-slate-300 italic">Unassigned</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border",
                                                        taskStatusColors[task.status] || 'text-slate-400 bg-slate-50 border-slate-100'
                                                    )}>
                                                        {task.status?.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest",
                                                        task.priority === 'HIGH' ? 'text-rose-500' : 
                                                        task.priority === 'MEDIUM' ? 'text-amber-500' : 'text-blue-500'
                                                    )}>
                                                        {task.priority}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <AlertCircle className="mx-auto text-slate-300 dark:text-slate-700 mb-2" size={32} />
                                <h4 className="text-sm font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">No tasks found</h4>
                                <p className="text-[11px] font-bold text-slate-300 dark:text-slate-700 mt-1">There are no tasks associated with this project yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
