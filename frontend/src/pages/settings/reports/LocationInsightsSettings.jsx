import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft,
    Plus,
    Upload,
    LocateFixed,
    Trash2,
    MapPin,
    Building2,
    Home,
    Share2,
    CheckCircle2,
    Search,
    ChevronDown,
    LayoutDashboard,
    PieChart,
    Building
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocationStore } from '../../../store/locationStore';
import { useAuthStore } from '../../../store/authStore';
import { AddLocationModal } from '../../../components/modals/AddLocationModal';
import { cn } from '../../../utils/cn';

export function LocationInsightsSettings() {
    const navigate = useNavigate();
    const { role } = useAuthStore();
    const routerLocation = useLocation();
    const { locationSettings, updateThreshold, importLocations, addLocation, deleteLocation, toggleAutoDetection } = useLocationStore();

    const rolePath = role ? `/${role.toLowerCase()}` : '';

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const triggerToast = (msg) => {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleImport = () => {
        const dummyLocations = [
            { name: 'San Francisco Hub', type: 'Office', address: 'Market St, SF', lat: 37.7749, lng: -122.4194, attendanceThreshold: 4 },
            { name: 'London Tech Park', type: 'Office', address: 'Old St, London', lat: 51.5074, lng: -0.1278, attendanceThreshold: 6 },
            { name: 'Bangalore Center', type: 'Office', address: 'Outer Ring Rd, BLR', lat: 12.9716, lng: 77.5946, attendanceThreshold: 4 }
        ];
        importLocations(dummyLocations);
        triggerToast('3 Locations Imported Successfully');
        setIsDropdownOpen(false);
    };

    const handleAutoDetect = () => {
        if ("geolocation" in navigator) {
            triggerToast('Detecting location...');
            navigator.geolocation.getCurrentPosition((position) => {
                const newLoc = {
                    name: `Detected Office (${new Date().toLocaleDateString()})`,
                    type: 'Office',
                    address: 'Auto-detected Coordinate',
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    attendanceThreshold: 4
                };
                addLocation(newLoc);
                triggerToast('New Location Auto-created');
            }, (error) => {
                // Fallback for simulation
                const mockLoc = {
                    name: 'Simulated Office',
                    type: 'Office',
                    address: 'Simulated Coordinate (Browser Denied)',
                    lat: 34.0522,
                    lng: -118.2437,
                    attendanceThreshold: 4
                };
                addLocation(mockLoc);
                triggerToast('Simulated Location Added');
            });
        }
    };

    const tabs = [
        { id: 'location-insights', label: 'Location Insights', icon: Building, path: `${rolePath}/settings/reports/location-insights` },
        { id: 'workload-distribution', label: 'Workload Distribution', icon: PieChart, path: `${rolePath}/settings/reports/workload-distribution` }
    ];

    const currentTab = routerLocation.pathname.includes('workload-distribution') ? 'workload-distribution' : 'location-insights';

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`${rolePath}/settings`)}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:scale-105 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            <span className="hover:text-slate-600 transition-colors cursor-pointer" onClick={() => navigate(`${rolePath}/settings`)}>Settings</span>
                            <span>/</span>
                            <span className="text-primary-600">Reports</span>
                        </nav>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Configuration</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Multi-action Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="h-12 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                        >
                            <Plus size={18} />
                            Add Location
                            <ChevronDown size={16} className={cn("transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[60] animate-in fade-in slide-in-from-top-2">
                                <button
                                    onClick={() => { setIsAddModalOpen(true); setIsDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <Plus size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Add New Location</p>
                                        <p className="text-[10px] font-bold text-slate-400">Manual entry</p>
                                    </div>
                                </button>
                                <button
                                    onClick={handleImport}
                                    className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600">
                                        <Upload size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Import Locations</p>
                                        <p className="text-[10px] font-bold text-slate-400">CSV simulation</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAutoDetect}
                        className="h-12 px-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:border-primary-500 hover:text-primary-600 transition-all active:scale-95"
                    >
                        <LocateFixed size={18} />
                        Auto-detection
                    </button>
                </div>
            </div>

            {/* Enterprise Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => navigate(tab.path)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                            currentTab === tab.id
                                ? "bg-white dark:bg-slate-800 text-primary-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Configuration Form & List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                        <div className="p-8 relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Office Locations</h3>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50 dark:bg-slate-800 px-4 py-1.5 rounded-full">
                                    {locationSettings.locations.length} Total
                                </div>
                            </div>

                            <div className="space-y-4">
                                {locationSettings.locations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                            <MapPin size={32} className="text-slate-300" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No locations configured yet</p>
                                    </div>
                                ) : (
                                    locationSettings.locations.map((loc) => (
                                        <div key={loc.id} className="group flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100/50 dark:border-slate-800/50 hover:border-primary-500/30 transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                                                    {loc.type === 'Office' ? <Building2 size={22} /> : loc.type === 'Remote' ? <Home size={22} /> : <Share2 size={22} />}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{loc.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-black text-primary-500 uppercase">{loc.type}</span>
                                                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">{loc.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-slate-900 dark:text-white">{loc.attendanceThreshold}h</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Threshold</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteLocation(loc.id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-red-500 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Global Settings & Info */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl -mr-16 -mt-16 rounded-full" />

                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary-400 mb-6 flex items-center gap-2">
                            <LayoutDashboard size={16} />
                            Universal Settings
                        </h3>

                        <div className="space-y-8">
                            {/* Threshold Control */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Default Attendance Threshold</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="number"
                                            value={locationSettings.attendanceThreshold}
                                            onChange={(e) => updateThreshold(parseFloat(e.target.value) || 0)}
                                            className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-6 font-bold text-white focus:border-primary-500 outline-none transition-all"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 font-black">HRS</span>
                                    </div>
                                </div>
                            </div>

                            {/* Auto Detection Toggle */}
                            <div className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/10">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-tight">Geo-Detection</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">Automatic office binding</p>
                                </div>
                                <button
                                    onClick={toggleAutoDetection}
                                    className={cn(
                                        "w-12 h-6 rounded-full relative transition-all duration-500",
                                        locationSettings.autoDetectionEnabled ? "bg-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-white/20"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 h-4 w-4 bg-white rounded-full transition-all duration-300 shadow-md",
                                        locationSettings.autoDetectionEnabled ? "left-7" : "left-1"
                                    )} />
                                </button>
                            </div>

                            {/* Help Box */}
                            <div className="p-6 bg-primary-500/10 rounded-[2rem] border border-primary-500/20">
                                <p className="text-[10px] font-bold text-primary-300 leading-relaxed italic">
                                    Enterprise locations allow you to filter reports by physical work zones. Thresholds determine compliance metrics in the Location Insights dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-emerald-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest">
                        <CheckCircle2 size={20} />
                        {toastMsg}
                    </div>
                </div>
            )}

            <AddLocationModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    triggerToast('New Location Added Successfully');
                }}
            />
        </div>
    );
}
