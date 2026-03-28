import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Monitor, User, Info, Download, ChevronRight, Apple, Laptop, Copy, Check, Plus, Trash2 } from 'lucide-react';
import { useEmployeeStore } from '../store/employeeStore';
import { useTeamStore } from '../store/teamStore';
import { useAuthStore } from '../store/authStore';
import { useOrganizationStore } from '../store/organizationStore';
import { logAction } from '../utils/logAction';
import { useToast } from '../context/ToastContext';

export function AddEmployeeModal({ isOpen, onClose }) {
    const { inviteEmployee, fetchEmployees } = useEmployeeStore();
    const { teams } = useTeamStore();
    const { user, role } = useAuthStore();
    const { organization } = useOrganizationStore();
    const { toast } = useToast();
    const [step, setStep] = useState('choice'); // choice, company, personal
    const [copied, setCopied] = useState(false);

    const rolePath = role?.toLowerCase() === 'admin' ? '/admin' : '/manager';
    const [personalEmployees, setPersonalEmployees] = useState([
        { id: 1, email: '', name: '', team: 'Default team', location: 'Remote' },
        { id: 2, email: '', name: '', team: 'Default team', location: 'Remote' },
        { id: 3, email: '', name: '', team: 'Default team', location: 'Remote' },
    ]);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText("https://app.insightful.io/#/installation/company/12345");
        setCopied(true);
        toast.success("Installation URL copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadWindows = () => {
        const dummyContent = "This is a mock installer file for Insightful.";
        const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'insightful-installer-win.exe');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const addAnotherEmployee = () => {
        setPersonalEmployees([...personalEmployees, { id: Date.now(), email: '', name: '', team: 'Default team', location: 'Remote' }]);
    };

    const removeEmployee = (id) => {
        setPersonalEmployees(personalEmployees.filter(emp => emp.id !== id));
    };

    const renderChoice = () => (
        <>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-8">Add New Employees & Download</h2>

            <div className="text-center mb-8">
                <p className="text-slate-600 dark:text-slate-400 font-bold text-sm mb-2">Choose Your Employee's Computer Type</p>
                <button className="text-indigo-500 text-xs font-bold flex items-center justify-center gap-1 mx-auto hover:underline">
                    <div className="w-4 h-4 rounded-full border border-indigo-200 flex items-center justify-center text-[10px]">?</div>
                    Not sure which to choose? Learn here.
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Company Computers */}
                <div
                    onClick={() => setStep('company')}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all group"
                >
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <Monitor size={40} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-300 dark:group-hover:text-indigo-400" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                        Employees work on company-owned computers, and only admins will be able to modify tracking settings.
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-tight">Company Computers</span>
                </div>

                {/* Personal Computers */}
                <div
                    onClick={() => setStep('personal')}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all group"
                >
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                        <div className="relative">
                            <User size={40} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-300 dark:group-hover:text-indigo-400" />
                            <div className="absolute -bottom-1 -right-1 bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-400 rounded-sm w-4 h-4 flex items-center justify-center">
                                <Apple size={10} className="text-white" />
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                        Employees work on their personal computers and should have the ability to control when Insightful tracks their activities.
                    </p>
                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-tight">Personal Computers</span>
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-lg p-4 flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-500">
                    <Info size={14} />
                </div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-400">
                    Adding computers will impact your billing. <button className="underline hover:text-amber-500">Learn More here.</button>
                </p>
            </div>
        </>
    );

    const renderCompany = () => (
        <>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-8 underline decoration-indigo-200 dark:decoration-indigo-800/50 underline-offset-8">Add New Employees - Company Computers</h2>

            <div className="space-y-4 mb-8">
                <p className="text-slate-700 dark:text-slate-400 font-bold text-sm">Download and install it on all employees' computers.</p>

                {/* Windows Download */}
                <div
                    onClick={handleDownloadWindows}
                    className="flex items-center justify-between p-4 border border-indigo-200 dark:border-indigo-800/50 bg-white dark:bg-slate-800/50 rounded-lg group cursor-pointer hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded flex items-center justify-center">
                            <Monitor size={24} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-black text-slate-800 dark:text-slate-200">Windows</span>
                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-500">?</div>
                        </div>
                    </div>
                    <Download size={20} className="text-indigo-500 dark:text-indigo-400" />
                </div>

                <p className="text-slate-700 dark:text-slate-400 font-bold text-sm pt-4">Read the instructions how to install it on employees' computers.</p>

                {/* macOS */}
                <div className="flex items-center justify-between p-4 border border-indigo-100 dark:border-indigo-900/40 bg-white dark:bg-slate-800/50 rounded-lg cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded flex items-center justify-center">
                            <Apple size={24} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">macOS</span>
                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-500">?</div>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-indigo-400 dark:text-indigo-500/80" />
                </div>

                {/* Linux */}
                <div className="flex items-center justify-between p-4 border border-indigo-100 dark:border-indigo-900/40 bg-white dark:bg-slate-800/50 rounded-lg cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <Laptop size={24} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Linux</span>
                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-500">?</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Beta</span>
                        <ChevronRight size={20} className="text-indigo-400 dark:text-indigo-500/80" />
                    </div>
                </div>
            </div>

            <div className="text-center mb-6">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">OR</span>
            </div>

            <div className="mb-8">
                <p className="text-slate-600 dark:text-slate-400 font-bold text-xs mb-2">Copy installation URL and send it to system administrators or employees</p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                        https://app.insightful.io/#/installation/company/123456789...
                    </div>
                    <button
                        onClick={handleCopy}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tight flex items-center gap-2 whitespace-nowrap hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy URL'}
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 rounded-lg p-4 flex items-start gap-3 mb-8">
                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center text-blue-600 dark:text-blue-500 mt-0.5">
                    <Info size={14} />
                </div>
                <p className="text-xs font-bold text-blue-800 dark:text-blue-400 leading-relaxed">
                    Employees will show up on your dashboard automatically after the installation, no other sign ups are required.
                </p>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => setStep('choice')}
                    className="px-6 py-2 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black uppercase tracking-tight hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                    Back
                </button>
            </div>
        </>
    );

    const renderPersonal = () => (
        <>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-8">Add New Employees - Personal Computers</h2>

            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3 text-[11px] font-bold text-slate-500 uppercase tracking-tight">Email</div>
                    <div className="col-span-3 text-[11px] font-bold text-slate-500 uppercase tracking-tight">Full Name</div>
                    <div className="col-span-3 text-[11px] font-bold text-slate-500 uppercase tracking-tight">Team</div>
                    <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase tracking-tight">Location</div>
                </div>

                {personalEmployees.map((emp, idx) => (
                    <div key={emp.id} className="grid grid-cols-12 gap-3 group">
                        <div className="col-span-3">
                            <input
                                type="email"
                                placeholder="Email"
                                value={emp.email}
                                onChange={(e) => {
                                    const newEmps = [...personalEmployees];
                                    newEmps[idx].email = e.target.value;
                                    setPersonalEmployees(newEmps);
                                }}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-3">
                            <input
                                type="text"
                                placeholder="Name"
                                value={emp.name}
                                onChange={(e) => {
                                    const newEmps = [...personalEmployees];
                                    newEmps[idx].name = e.target.value;
                                    setPersonalEmployees(newEmps);
                                }}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-3">
                            <select
                                value={emp.team}
                                onChange={(e) => {
                                    const newEmps = [...personalEmployees];
                                    newEmps[idx].team = e.target.value;
                                    setPersonalEmployees(newEmps);
                                }}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select team</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <select
                                value={emp.location}
                                onChange={(e) => {
                                    const newEmps = [...personalEmployees];
                                    newEmps[idx].location = e.target.value;
                                    setPersonalEmployees(newEmps);
                                }}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-xs dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="Remote">Remote</option>
                                <option value="Office">Office</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                            <button
                                onClick={() => removeEmployee(emp.id)}
                                className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={addAnotherEmployee}
                    className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-tight hover:text-indigo-700 decoration-indigo-200"
                >
                    <Plus size={16} strokeWidth={3} />
                    Add Another Employee
                </button>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => setStep('choice')}
                    className="px-6 py-2 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black uppercase tracking-tight hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                    Back
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-indigo-100 dark:border-indigo-900/50 text-indigo-400 dark:text-indigo-500 rounded-lg text-xs font-black uppercase tracking-tight hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            if (!orgId) {
                                toast.error("No organization ID found. Please try logging in again.");
                                return;
                            }

                            let successCount = 0;
                            let failCount = 0;

                            for (const emp of personalEmployees) {
                                if (emp.email && emp.name) {
                                    const selectedTeamId = (emp.team === 'Default team' || !emp.team)
                                        ? teams[0]?.id
                                        : emp.team;

                                    if (!selectedTeamId) continue;

                                    try {
                                        const res = await inviteEmployee({
                                            fullName: emp.name,
                                            email: emp.email,
                                            teamId: selectedTeamId,
                                            location: emp.location || 'Remote',
                                            computerType: 'PERSONAL',
                                            organizationId: orgId
                                        });
                                        
                                        // Log for testing as requested by user - Made extremely prominent
                                        console.log("%c 🚀 [INVITATION SENT] 🚀 ", 'background: #10b981; color: white; font-size: 16px; font-weight: bold; padding: 4px; border-radius: 4px;');
                                        console.log(`%c User: ${emp.email}`, 'color: #10b981; font-weight: bold;');
                                        if (res.setupLink) {
                                            console.log(`%c SETUP LINK: %c ${res.setupLink} `, 'color: #6366f1; font-weight: bold;', 'background: #6366f1; color: white; padding: 2px; border-radius: 2px;');
                                        }
                                        console.log("Full Response Object:", res);

                                        logAction(user?.name || 'Admin', 'Owner', 'Create', 'Employee', `Invited new employee: "${emp.name}"`);
                                        successCount++;
                                    } catch (err) {
                                        failCount++;
                                        const errorMsg = err.response?.data?.message || err.message;
                                        toast.error(`Error inviting ${emp.email}: ${errorMsg}`);
                                        if (errorMsg.toLowerCase().includes("duplicate")) break;
                                    }
                                }
                            }

                            if (successCount > 0) {
                                await fetchEmployees();
                                toast.success(`${successCount} employee(s) invited successfully!`);
                                if (failCount === 0) {
                                    onClose();
                                }
                            }
                        }}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-xs font-black uppercase tracking-tight shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
                    >
                        Send Invitations
                    </button>
                </div>
            </div>
        </>
    );

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-hidden p-4">
            <div className="absolute inset-0 transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl animate-scale-in overflow-hidden flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-[10]"
                >
                    <X size={20} />
                </button>

                <div className="overflow-y-auto max-h-[85vh] px-6 py-8 sm:px-8">
                    {step === 'choice' && renderChoice()}
                    {step === 'company' && renderCompany()}
                    {step === 'personal' && renderPersonal()}
                </div>
            </div>
        </div>,
        document.body
    );
}
