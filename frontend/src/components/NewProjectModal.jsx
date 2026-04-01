import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

export function NewProjectModal({ isOpen, onClose, employees = [], teams = [], initialData = null }) {
    const { createProject, updateProject } = useProjectStore();
    const [billRateType, setBillRateType] = useState('Project');
    const [projectName, setProjectName] = useState('');
    const [projectBillRate, setProjectBillRate] = useState('0');
    const [projectBudget, setProjectBudget] = useState('0');
    const [description, setDescription] = useState('');
    const [showError, setShowError] = useState(false);


    useEffect(() => {
        if (initialData) {
            setProjectName(initialData.projectName || initialData.name || '');
            setProjectBillRate(String(initialData.billRate || '0'));
            setProjectBudget(String(initialData.budget || initialData.totalCosts || '0'));
            setDescription(initialData.description || '');
        } else {
            setProjectName('');
            setProjectBillRate('0');
            setProjectBudget('0');
            setDescription('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;


    const handleSave = async () => {
        if (!projectName.trim()) {
            setShowError(true);
            return;
        }

        const projectData = {
            name: projectName,
            description: description,
            billRate: Number(projectBillRate),
            budget: Number(projectBudget),
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
                setProjectBudget('0');
                setDescription('');
            }
            setShowError(false);
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Bill rate</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-xs">$</span>
                                    <input
                                        type="number"
                                        value={projectBillRate}
                                        onChange={(e) => setProjectBillRate(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-6 pr-3 py-3 text-xs font-medium dark:text-slate-200 outline-none transition-all focus:border-primary-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Costs</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-xs">$</span>
                                    <input
                                        type="number"
                                        value={projectBudget}
                                        onChange={(e) => setProjectBudget(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-6 pr-3 py-3 text-xs font-medium dark:text-slate-200 outline-none transition-all focus:border-primary-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Description */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Project Description</label>
                        <div className="relative">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter project description..."
                                rows={6}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-4 text-sm font-medium dark:text-slate-200 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none font-sans"
                            />
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
