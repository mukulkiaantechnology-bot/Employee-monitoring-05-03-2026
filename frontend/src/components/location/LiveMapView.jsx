import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, Navigation, AlertCircle, RefreshCw } from 'lucide-react';
import apiClient from '../../services/apiClient';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [20, 0]; // Default global view

const createCustomIcon = (isActive) => {
    const color = isActive ? '#10b981' : '#94a3b8';
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`;
    
    return L.divIcon({
        className: 'custom-leaflet-icon',
        html: svgIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

// Component to dynamically hook map focus
function MapUpdater({ selectedEmp, center }) {
    const map = useMap();
    useEffect(() => {
        if (selectedEmp && selectedEmp.latitude && selectedEmp.longitude) {
            map.flyTo([selectedEmp.latitude, selectedEmp.longitude], 15, { duration: 1.5 });
        } else if (center) {
            map.flyTo(center, map.getZoom(), { duration: 1.5 });
        }
    }, [selectedEmp, center, map]);
    return null;
}

const EmployeeLocationRow = ({ emp, isActive, onClick }) => {
    return (
        <div 
            onClick={() => onClick(emp)}
            className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                        {emp.avatar ? (
                            <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-black text-sm">
                                {emp.name?.substring(0, 2).toUpperCase() || '??'}
                            </div>
                        )}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{emp.name}</h4>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <MapPin size={10} className={isActive ? 'text-emerald-500' : 'text-slate-400'} />
                        {emp.latitude && emp.longitude 
                            ? `${emp.latitude.toFixed(4)}, ${emp.longitude.toFixed(4)}` 
                            : 'Unknown Location'}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    isActive 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                    {isActive ? 'Active Now' : 'Last Seen'}
                </span>
                {emp.lastUpdate && (
                    <p className="text-[10px] font-medium text-slate-400 mt-1">
                        {new Date(emp.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
            </div>
        </div>
    );
};

export const LiveMapView = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const fetchLiveLocations = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/location/live');
            if (res.data?.success) {
                setEmployees(res.data.data);
                // Center map on first valid active point if it's the first load
                if (mapCenter[0] === 20 && res.data.data.length > 0) {
                    const firstValid = res.data.data.find(e => e.latitude && e.longitude);
                    if (firstValid) {
                        setMapCenter([firstValid.latitude, firstValid.longitude]);
                    }
                }
            } else {
                throw new Error(res.data?.message || 'Failed to fetch tracking data');
            }
        } catch (err) {
            console.error('Map Fetch Error:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
            setLastRefresh(new Date());
        }
    }, [mapCenter]);

    useEffect(() => {
        fetchLiveLocations();
        // Refresh every 30 seconds implicitly
        const interval = setInterval(fetchLiveLocations, 30000);
        return () => clearInterval(interval);
    }, [fetchLiveLocations]);

    // Filter and Sort Employees
    const ACTIVE_THRESHOLD_MINUTES = 15;
    const now = new Date();

    const processedEmployees = employees
        .filter(e => {
            const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                                (e.team && e.team.toLowerCase().includes(search.toLowerCase()));
            return matchesSearch;
        })
        .map(e => {
            const lastLogTime = e.lastUpdate ? new Date(e.lastUpdate) : new Date(0);
            const diffMins = (now - lastLogTime) / (1000 * 60);
            const isActive = e.latitude && e.longitude && diffMins <= ACTIVE_THRESHOLD_MINUTES;
            return { ...e, isActive };
        })
        .sort((a, b) => {
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;
            return a.name.localeCompare(b.name);
        });

    const activeList = processedEmployees.filter(e => e.isActive);
    const inactiveList = processedEmployees.filter(e => !e.isActive);

    const handleEmployeeClick = async (emp) => {
        if (emp.latitude && emp.longitude) {
            setSelectedEmp(emp);
        }
        
        // Also fetch individual history as requested (Bonus action for clicks)
        try {
            await apiClient.get(`/location/${emp.id}`);
        } catch (err) {
            console.error('Error fetching deep history for', emp.id, err);
        }
    };

    return (
        <div className="lg:h-[calc(100vh-280px)] min-h-[600px] lg:min-h-[500px] flex flex-col lg:flex-row gap-4 mt-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Left Panel: Employee List */}
            <div className="w-full lg:w-80 h-[400px] lg:h-auto shrink-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                        Tracking Roster
                        <button onClick={fetchLiveLocations} className="text-slate-400 hover:text-primary-500 transition-colors" title="Refresh Live Map">
                            <RefreshCw size={14} className={loading && !employees.length ? 'animate-spin text-primary-500' : ''} />
                        </button>
                    </h3>
                    <div className="relative mt-3">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Find employee..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary-500/20 outline-none dark:text-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                    {error && (
                        <div className="m-2 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-lg flex items-start gap-2 text-rose-600 dark:text-rose-400">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold">{error}</p>
                        </div>
                    )}

                    <div className="px-2 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0 bg-white dark:bg-slate-900 backdrop-blur-md z-10 border-b border-slate-50 dark:border-slate-800">
                        Active Employees ({activeList.length})
                    </div>
                    <div className="space-y-1">
                        {activeList.map(emp => (
                            <EmployeeLocationRow key={emp.id} emp={emp} isActive={true} onClick={handleEmployeeClick} />
                        ))}
                        {activeList.length === 0 && <div className="px-3 py-4 text-xs font-medium text-slate-400 text-center">No active tracking signals.</div>}
                    </div>

                    <div className="px-2 pt-6 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0 bg-white dark:bg-slate-900 backdrop-blur-md z-10 border-b border-slate-50 dark:border-slate-800">
                        Inactive / Offline ({inactiveList.length})
                    </div>
                    <div className="space-y-1">
                        {inactiveList.map(emp => (
                            <EmployeeLocationRow key={emp.id} emp={emp} isActive={false} onClick={handleEmployeeClick} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel: Map */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative z-0">
                <MapContainer 
                    center={mapCenter} 
                    zoom={4} 
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    <MapUpdater selectedEmp={selectedEmp} center={mapCenter} />

                    {processedEmployees.map(emp => {
                        if (!emp.latitude || !emp.longitude) return null;
                        return (
                            <Marker
                                key={emp.id}
                                position={[emp.latitude, emp.longitude]}
                                icon={createCustomIcon(emp.isActive)}
                                eventHandlers={{
                                    click: () => setSelectedEmp(emp),
                                }}
                            >
                                <Popup minWidth={150}>
                                    <div className="p-0 font-sans">
                                        <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                                            <img 
                                                src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.name}`} 
                                                alt="" 
                                                className="w-8 h-8 rounded-full" 
                                            />
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-800 m-0 leading-tight">{emp.name}</h4>
                                                <p className="text-[10px] text-emerald-600 m-0 font-bold">{emp.isActive ? 'Active' : 'Offline'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-slate-500 m-0"><strong className="text-slate-700">Source:</strong> {emp.source || 'GPS'}</p>
                                            <p className="text-[10px] text-slate-500 m-0"><strong className="text-slate-700">Updated:</strong> {emp.lastUpdate ? new Date(emp.lastUpdate).toLocaleTimeString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>

                {/* Optional overlay banner if we want to show anything */}
                <div className="absolute top-4 right-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 text-[10px] font-bold text-slate-500 rounded-md shadow flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    OpenStreetMap Powered
                </div>
            </div>
        </div>
    );
};
