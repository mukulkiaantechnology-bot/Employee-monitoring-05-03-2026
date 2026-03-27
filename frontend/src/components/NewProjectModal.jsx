import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

export function NewProjectModal({ isOpen, onClose, employees = [], teams = [], initialData = null }) {
    const { createProject, updateProject } = useProjectStore();
    const [billRateType, setBillRateType] = useState('Project');
    const [projectName, setProjectName] = useState('');
    const [projectBillRate, setProjectBillRate] = useState('0');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showError, setShowError] = useState(false);

    const filteredEmployees = useMemo(() => {
        return employees.map(emp => ({
            id: emp.id,
            name: emp.fullName || emp.name,
            team: emp.team?.name || emp.team || 'Unassigned'
        })).filter(emp =>
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.team.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [employees, searchQuery]);

    useEffect(() => {
        if (initialData) {
            setProjectName(initialData.projectName || initialData.name || '');
            setProjectBillRate(String(initialData.billRate || '0'));
            setSelectedEmployees(initialData.employeeIds || initialData.assignments?.map(a => a.employeeId) || []);
        } else {
            setProjectName('');
            setProjectBillRate('0');
            setSelectedEmployees([]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const toggleEmployee = (empId) => {
        setSelectedEmployees(prev =>
            prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
        );
    };

    const handleSave = async () => {
        if (!projectName.trim()) {
            setShowError(true);
            return;
        }

        const projectData = {
            name: projectName,
            billRate: Number(projectBillRate),
            employeeIds: selectedEmployees,
        };

        try {
            if (initialData) {
                await updateProject(initialData.id, projectData);
            } else {
                await createProject(projectData);
            }
            onClose();
            // Reset state if creating
            if (!initialData) {
                setProjectName('');
                setProjectBillRate('0');
                setSelectedEmployees([]);
            }
            setShowError(false);
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-scale-in overflow-hidden border border-slate-100 dark:border-slate-800">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">{initialData ? 'Edit Project' : 'New project'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Bill Rate Type Selection */}
                    <div className="space-y-2">
                        {/* <label className="text-xs font-bold text-slate-400 dark:text-slate-500">Bill Rate</label> */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* <button
                                onClick={() => setBillRateType('Project')}
                                className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${billRateType === 'Project'
                                    ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold'
                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billRateType === 'Project' ? 'border-primary-600 dark:border-primary-500' : 'border-slate-300 dark:border-slate-700'}`}>
                                    {billRateType === 'Project' && <div className="w-2.5 h-2.5 bg-primary-600 dark:bg-primary-500 rounded-full" />}
                                </div>
                                <span className="text-sm">Project Bill Rate</span>
                            </button> */}
                            {/* <button
                                onClick={() => setBillRateType('Employee')}
                                className={`flex items-center gap-3 p-4 border rounded-xl transition-all ${billRateType === 'Employee'
                                    ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-bold'
                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${billRateType === 'Employee' ? 'border-primary-600 dark:border-primary-500' : 'border-slate-300 dark:border-slate-700'}`}>
                                    {billRateType === 'Employee' && <div className="w-2.5 h-2.5 bg-primary-600 dark:bg-primary-500 rounded-full" />}
                                </div>
                                <span className="text-sm">Employee Bill Rate</span>
                            </button> */}
                        </div>
                    </div>

                    {/* Project Name & Rate Wrapper */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Project Name</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => {
                                    setProjectName(e.target.value);
                                    if (showError) setShowError(false);
                                }}
                                placeholder="Enter project name"
                                className={`w-full bg-white dark:bg-slate-950 border rounded-lg px-4 py-3 text-sm font-medium dark:text-slate-200 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 ${showError ? 'border-rose-400 dark:border-rose-500/50' : 'border-slate-200 dark:border-slate-800'}`}
                            />
                            {showError && <p className="text-[10px] text-rose-500 font-bold">Project name is required</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Project Bill rate</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">$</span>
                                <input
                                    type="number"
                                    value={projectBillRate}
                                    onChange={(e) => setProjectBillRate(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-4 py-3 text-sm font-medium dark:text-slate-200 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Employee Selection */}
                    <div className="space-y-4 pt-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Employees on Project</label>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search employees"
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Select Employees</span>
                                <button
                                    onClick={() => setSelectedEmployees(filteredEmployees.map(e => e.id))}
                                    className="text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:underline"
                                >
                                    Select All
                                </button>
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {filteredEmployees.map(emp => (
                                    <div
                                        key={emp.id}
                                        onClick={() => toggleEmployee(emp.id)}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-colors group cursor-pointer border ${selectedEmployees.includes(emp.id)
                                            ? 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-800/50'
                                            : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                {emp.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block leading-tight">{emp.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{emp.team}</span>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedEmployees.includes(emp.id)
                                            ? 'bg-primary-600 border-primary-600'
                                            : 'border-slate-200 dark:border-slate-700 group-hover:border-primary-400'}`}>
                                            {selectedEmployees.includes(emp.id) && <Check size={14} className="text-white" />}
                                        </div>
                                    </div>
                                ))}
                                {filteredEmployees.length === 0 && (
                                    <p className="text-center py-4 text-xs text-slate-400 font-bold">No employees found</p>
                                )}
                            </div>
                            {/* Selected Employees Table */}
                            {selectedEmployees.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Selected Members ({selectedEmployees.length})</span>
                                    </div>
                                    <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                                <tr>
                                                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                                    <th className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team</th>
                                                    <th className="px-4 py-2 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                                {employees.filter(emp => selectedEmployees.includes(emp.id)).map(emp => (
                                                    <tr key={emp.id} className="bg-white dark:bg-slate-900 group/row hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-[10px] font-black text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50">
                                                                    {emp.name.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{emp.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{emp.team}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleEmployee(emp.id); }}
                                                                className="text-rose-500 hover:text-rose-600 p-1 opacity-100 md:opacity-0 group-hover/row:opacity-100 transition-opacity"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-10 py-3 border border-primary-200 dark:border-primary-800/50 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-black uppercase tracking-tight hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-black uppercase tracking-tight shadow-xl shadow-primary-200 dark:shadow-primary-900/20 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
