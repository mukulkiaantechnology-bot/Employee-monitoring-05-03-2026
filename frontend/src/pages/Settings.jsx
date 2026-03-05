// import React from 'react';
// import {
//     Bell,
//     Key,
//     ClipboardList,
//     CreditCard,
//     Mail,
//     Puzzle,
//     Clock,
//     Building,
//     Shield,
//     LineChart,
//     PieChart,
//     Users,
//     Calculator,
//     Laptop,
//     Search
// } from 'lucide-react';

// const SettingCard = ({ icon: Icon, title, description }) => (
//     <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
//         <div className="flex items-start gap-4">
//             <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
//                 <Icon size={24} strokeWidth={1.5} />
//             </div>
//             <div className="flex-1">
//                 <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-primary-700 transition-colors">{title}</h3>
//                 <p className="text-xs text-slate-400 font-medium leading-relaxed">{description}</p>
//             </div>
//         </div>
//     </div>
// );

// export function Settings() {
//     const settingItems = [
//         { icon: Bell, title: "Alerts", description: "Manage your notifications related to attendance, security and shift scheduling" },
//         { icon: Key, title: "API Tokens", description: "View, manage and create API Tokens." },
//         { icon: ClipboardList, title: "Audit Logs", description: "View and manage audit logs on an organization level." },
//         { icon: CreditCard, title: "Billing", description: "Manage your subscriptions, billing details, and view or download invoices." },
//         { icon: Mail, title: "Email Reports", description: "Manage your email reports on an organization level." },
//         { icon: Puzzle, title: "Integrations", description: "View and configure your Insightful integrations." },
//         { icon: Clock, title: "Manual Time", description: "Manage manual time settings like notifications, types, etc." },
//         { icon: Building, title: "Organization", description: "View and update basic info about your company." },
//         { icon: Shield, title: "Privacy", description: "View and change privacy-related settings on an organizational level." },
//         { icon: LineChart, title: "Productivity", description: "Manage your productivity labels on an organization, team and individual level." },
//         { icon: PieChart, title: "Reports", description: "View and manage office locations and workload in your organization." },
//         { icon: Shield, title: "Security and Identity", description: "View and configure security-related settings like authentication and SSO." },
//         { icon: Laptop, title: "Tracking Settings", description: "View and configure Insightful Agent settings." },
//         { icon: Users, title: "User Management", description: "View and manage user roles in your organization." },
//         { icon: Calculator, title: "Utilization", description: "View and manage utilization calculation on organizational level." },
//     ];

//     return (
//         <div className="min-h-screen bg-[#fcfdfe] pb-12 px-2 sm:px-4 lg:px-8">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-8">
//                 <div>
//                     <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
//                 </div>
//                 <div className="relative group w-full md:w-64">
//                     <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
//                     <input
//                         type="text"
//                         placeholder="Search"
//                         className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
//                     />
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {settingItems.map((item, idx) => (
//                     <SettingCard key={idx} {...item} />
//                 ))}
//             </div>
//         </div>
//     );
// }





import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    Bell,
    Key,
    ClipboardList,
    CreditCard,
    Mail,
    Puzzle,
    Clock,
    Building,
    Shield,
    LineChart,
    PieChart,
    Users,
    UserCircle,
    Calculator,
    Laptop,
    Search
} from 'lucide-react';

const SettingCard = ({ icon: Icon, title, description, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/20 transition-all cursor-pointer group"
    >
        <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-500/10 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{title}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

export function Settings() {
    const navigate = useNavigate();
    const { role } = useAuthStore();
    const [searchQuery, setSearchQuery] = React.useState('');

    const rolePath = role ? `/${role.toLowerCase()}` : '';

    const settingItemsData = [
        { icon: UserCircle, title: "Personal Settings", description: "Manage your personal information, profile picture, and localization preferences.", path: "/settings/personal" },
        { icon: Bell, title: "Alerts", description: "Manage your notifications related to attendance, security and shift scheduling", path: "/settings/alerts" },
        { icon: Key, title: "API Tokens", description: "View, manage and create API Tokens.", path: "/settings/api-tokens" },
        // { icon: ClipboardList, title: "Audit Logs", description: "View and manage audit logs on an organization level.", path: "/settings/audit-logs" },
        // { icon: CreditCard, title: "Billing", description: "Manage your subscriptions, billing details, and view or download invoices.", path: "/settings/billing" },
        { icon: Mail, title: "Email Reports", description: "Manage your email reports on an organization level.", path: "/settings/email-reports" },
        { icon: Puzzle, title: "Integrations", description: "View and configure your Insightful integrations.", path: "/settings/integrations" },
        { icon: Clock, title: "Manual Time", description: "Manage manual time settings like notifications, types, etc.", path: "/settings/manual-time" },
        { icon: Building, title: "Organization", description: "View and update basic info about your company.", path: "/settings/organization" },
        { icon: Shield, title: "Privacy", description: "View and change privacy-related settings on an organizational level.", path: "/settings/privacy" },
        { icon: LineChart, title: "Productivity", description: "Manage your productivity labels on an organization, team and individual level.", path: "/settings/productivity/apps" },
        { icon: PieChart, title: "Reports", description: "View and manage office locations and workload in your organization.", path: "/settings/reports/workload-distribution" },
        { icon: Shield, title: "Security and Identity", description: "View and configure security-related settings like authentication and SSO.", path: "/settings/security" },
        { icon: Laptop, title: "Tracking Settings", description: "View and configure Insightful Agent settings.", path: "/settings/tracking" },
        // { icon: Users, title: "User Management", description: "View and manage user roles in your organization.", path: "/settings/user-management/users" },
        { icon: Calculator, title: "Utilization", description: "View and manage utilization calculation on organizational level.", path: "/settings/utilization" },
    ];

    const settingItems = settingItemsData.map(item => ({
        ...item,
        path: `${rolePath}${item.path}`
    }));

    const filteredItems = settingItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 pb-12 px-2 sm:px-4 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
                </div>
                <div className="relative group w-full md:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
                    <SettingCard
                        key={idx}
                        {...item}
                        onClick={() => item.path && navigate(item.path)}
                    />
                )) : (
                    <div className="col-span-3 py-20 text-center">
                        <p className="text-sm font-bold text-slate-400">No settings found for &ldquo;{searchQuery}&rdquo;</p>
                    </div>
                )}
            </div>
        </div>
    );
}