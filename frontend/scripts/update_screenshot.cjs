const fs = require('fs');
const file = 'd:/insightful 26-02-2026/src/pages/ScreenshotMonitoring.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace Dummy Data
const newDummyData = `
const employeesList = [
    { id: 1, name: "Anil", team: "Engineering" },
    { id: 2, name: "Annu", team: "Marketing" },
    { id: 3, name: "Rehan", team: "Design" },
    { id: 4, name: "Soni", team: "Sales" }
];

const dummyScreenshots = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    employeeId: (i % 4) + 1,
    employee: ["Anil", "Annu", "Rehan", "Soni"][i % 4],
    team: ["Engineering", "Marketing", "Design", "Sales"][i % 4],
    app: ["Chrome", "Figma", "VS Code", "Excel"][i % 4],
    project: ["CRM", "Landing Page", "Dashboard", "Analytics"][i % 4],
    task: ["UI Fix", "Design", "API", "Report"][i % 4],
    productivity: ["productive", "neutral", "unproductive"][i % 3],
    type: ["automatic", "manual"][i % 2],
    category: ["work", "review", "testing"][i % 3],
    timestamp: new Date(2026, 1, 20 + (i % 7)).toISOString(),
    image: "https://picsum.photos/400/250?random=" + (i+1)
}));
`;

content = content.replace(/const dummyScreenshots = \[[\s\S]*?\];/, newDummyData);

// 2. Add ref imports
if (!content.includes('useRef')) {
    content = content.replace('useState, useEffect, useMemo, useCallback, memo', 'useState, useRef, useEffect, useMemo, useCallback, memo');
}
if (!content.includes('Check,')) {
    content = content.replace('Plus', 'Plus, Check');
}


// 3. States for the new UI elements
const targetStates = `    const [activeFilter, setActiveFilter] = useState('All');`;
const replacementStates = `    const [activeFilter, setActiveFilter] = useState('All');
    
    // UI states
    const [selectedPreset, setSelectedPreset] = useState('All Time');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Calendar specific states
    const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
    const calendarRef = useRef(null);
    
    // Add Filter specific states
    const [showAddFilterDropdown, setShowAddFilterDropdown] = useState(false);
    const filterRef = useRef(null);
    
    // Employee Modal states
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employeeModalSearch, setEmployeeModalSearch] = useState('');

    // Outside click handlers
    useEffect(() => {
        function handleClickOutside(event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendarDropdown(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowAddFilterDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
`;

content = content.replace(targetStates, replacementStates);

// 4. Update filtering logic
const targetFilterLogic = `        let result = localScreenshots.filter(s => {`;
const newFilterLogic = `        let result = localScreenshots.filter(s => {
            // Employee Checkbox Filter
            if (selectedEmployees.length > 0 && !selectedEmployees.includes(s.employeeId)) return false;
`;

content = content.replace(targetFilterLogic, newFilterLogic);

// Add Employee Modal code and Calendar code
// Find the location right before return ( inside ScreenshotMonitoring
const targetReturn = `    return (
        <>
            <div className="space-y-6 sm:space-y-8 pb-20 px-4 sm:px-0 max-w-full overflow-x-hidden box-border animate-fade-in">`;


const UIControlsOld = `{/* Employee Selector (Searchable) */}
                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}`;

const UIControlsEndOld = `                        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center">
                            <button
                                onClick={() => setViewMode('grid')}`;

const newUIControlsHtml = `                        {/* Header Left: Calendar, Add Filter */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Calendar Trigger */}
                            <div className="relative" ref={calendarRef}>
                                <button
                                    onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 sm:py-2.5 border rounded-xl text-sm font-bold transition-all shadow-sm",
                                        selectedPreset !== 'All Time'
                                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                    )}
                                >
                                    <Calendar size={16} className={selectedPreset !== 'All Time' ? "text-indigo-600" : "text-slate-400"} />
                                    <span>{selectedPreset === 'All Time' ? 'Date range' : selectedPreset}</span>
                                </button>
                                
                                {/* Calendar Popover */}
                                {showCalendarDropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-[400px] sm:w-[500px] lg:w-[600px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col sm:flex-row animate-in fade-in zoom-in duration-200 origin-top-left">
                                        
                                        <div className="flex flex-col flex-1 min-h-[300px]">
                                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
                                            <span className="text-xs font-black tracking-widest text-slate-900 uppercase">Calendar</span>
                                            <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                                                <Globe size={14} className="text-indigo-500" />
                                                Employees' Time Zone
                                                <ChevronDown size={14} />
                                            </button>
                                        </div>
                                            {/* Calendar Left */}
                                            <div className="flex-1 p-6">
                                                <div className="flex justify-between items-center mb-6">
                                                    <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })} <ChevronDown size={14} className="inline ml-1" /></span>
                                                    <div className="flex gap-2 text-slate-400">
                                                        <button onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() - 1); setViewDate(d); }} className="hover:text-slate-900"><ChevronLeft size={18} /></button>
                                                        <button onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() + 1); setViewDate(d); }} className="hover:text-slate-900"><ChevronRight size={18} /></button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-4 text-center">
                                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                                        <div key={d} className="text-[10px] font-black text-slate-400 uppercase">{d}</div>
                                                    ))}
                                                    {(() => {
                                                        const year = viewDate.getFullYear();
                                                        const month = viewDate.getMonth();
                                                        const firstDay = new Date(year, month, 1).getDay();
                                                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                                                        const prevMonthDays = new Date(year, month, 0).getDate();
                                                        const cells = [];
                                                        for (let i = firstDay - 1; i >= 0; i--) {
                                                            cells.push(<div key={"prev-"+i} className="h-8 flex items-center justify-center text-xs font-bold text-slate-200">{prevMonthDays - i}</div>);
                                                        }
                                                        for (let day = 1; day <= daysInMonth; day++) {
                                                            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                                                            const isSelected = selectedPreset.includes('Today') && isToday; // Dummy selection logic
                                                            cells.push(
                                                                <button
                                                                    key={"day-"+day}
                                                                    onClick={() => {}}
                                                                    className={cn("h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all", isSelected ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100")}
                                                                >
                                                                    {day}
                                                                </button>
                                                            );
                                                        }
                                                        return cells;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Presets Right */}
                                        <div className="w-full sm:w-48 bg-slate-50/50 flex flex-col py-2 border-t sm:border-t-0 sm:border-l border-slate-100">
                                            <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Preset Filters</div>
                                            <div className="flex-1 overflow-y-auto max-h-[200px] sm:max-h-full custom-scrollbar">
                                            {['Today', 'Yesterday', 'This Week', 'Last 7 Days', 'Previous Week', 'This Month', 'Previous Month', 'Last 3 Months', 'Last 6 Months'].map(preset => (
                                                <button key={preset} onClick={() => setSelectedPreset(preset)} className={cn("w-full text-left px-4 py-2 text-sm font-bold transition-all", selectedPreset === preset ? "bg-indigo-100/50 text-indigo-700" : "text-slate-600 hover:bg-slate-100")}>
                                                    {preset}
                                                </button>
                                            ))}
                                            </div>
                                        </div>
                                        {/* Footer (Absolute Bottom) */}
                                        {/* Note: This footer in Insightful is typically part of the left column. Refining layout here. */}
                                    </div>
                                )}
                            </div>

                            {/* Add Filter Trigger */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setShowAddFilterDropdown(!showAddFilterDropdown)}
                                    className="flex items-center gap-2 px-4 py-2 sm:py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                                >
                                    <Plus size={16} />
                                    <span>Add Filter</span>
                                </button>
                                
                                {/* Add Filter Popover */}
                                {showAddFilterDropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200 origin-top-left">
                                        <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">Filter By</div>
                                        {[
                                            { id: 'employees', label: 'Employees' },
                                            { id: 'teams', label: 'Teams' },
                                            { id: 'apps', label: 'Apps & Websites' },
                                            { id: 'projects', label: 'Projects' },
                                            { id: 'tasks', label: 'Tasks' },
                                            { id: 'types', label: 'Screenshot types' },
                                            { id: 'productivity', label: 'Productivity types' },
                                            { id: 'category', label: 'Category' },
                                        ].map(f => (
                                           <button 
                                                key={f.id} 
                                                onClick={() => { 
                                                    if (f.id === 'employees') setShowEmployeeModal(true);
                                                    setShowAddFilterDropdown(false); 
                                                }} 
                                                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors"
                                            >
                                              {f.label}
                                           </button> 
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Active Employee Tags */}
                            {selectedEmployees.length > 0 && (
                                <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 gap-2 shadow-sm">
                                    <span className="text-xs font-bold text-indigo-700">Employees <span className="text-indigo-400">({selectedEmployees.length})</span></span>
                                    <button onClick={() => setSelectedEmployees([])} className="p-0.5 hover:bg-indigo-200 rounded-md text-indigo-400 hover:text-indigo-700 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Header Right: Sort, View Toggle */}
                        <div className="flex flex-wrap items-center gap-3 ml-auto">
                            {/* Search */}
                            <div className="hidden sm:block relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-48 pl-9 pr-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 sm:py-2.5 bg-transparent text-sm font-bold text-indigo-600 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors focus:outline-none"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none" />
                            </div>
`;

// Need to safely replace this section
let startIdx = content.indexOf('{/* Employee Selector (Searchable) */}');
let endIdx = content.indexOf('<div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center">');
if (startIdx > -1 && endIdx > -1) {
    let part1 = content.substring(0, startIdx);
    let part2 = content.substring(endIdx);
    content = part1 + newUIControlsHtml + '\n                        ' + part2;
} else if (startIdx > -1) { // If original section was modified
    let endAlternative = content.indexOf('<div className="flex bg-slate-100', startIdx);
    let part1 = content.substring(0, startIdx);
    let part2 = content.substring(endAlternative);
    content = part1 + newUIControlsHtml + '\n                        ' + part2;
}


// Add 'Globe' to lucide-react imports if not there
if (!content.includes('Globe,')) {
    content = content.replace('Plus', 'Plus, Globe');
}
if (!content.includes('Check,')) {
    content = content.replace('Plus', 'Plus, Check');
}

// Add Employee Modal code at the end
const employeeModalCode = `
            {/* Employee Multi-Select Modal */}
            {showEmployeeModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                        <div className="flex flex-col sm:flex-row h-[450px]">
                            {/* Left Column: All Employees */}
                            <div className="flex-1 flex flex-col sm:border-r border-slate-100 bg-white">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employees</span>
                                    <button 
                                        onClick={() => setSelectedEmployees(employeesList.map(e => e.id))}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                                    >Select all</button>
                                </div>
                                <div className="p-3">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={employeeModalSearch}
                                            onChange={e => setEmployeeModalSearch(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                                    {employeesList.filter(e => e.name.toLowerCase().includes(employeeModalSearch.toLowerCase())).map(emp => (
                                        <label key={emp.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors">
                                            <div className={cn(
                                                "w-5 h-5 rounded flex items-center justify-center border transition-all",
                                                selectedEmployees.includes(emp.id) ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300 group-hover:border-indigo-400"
                                            )}>
                                                {selectedEmployees.includes(emp.id) && <Check size={12} className="text-white" />}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{emp.name.charAt(0)}</div>
                                                <span className="text-sm font-bold text-slate-700">{emp.name}</span>
                                            </div>
                                        </label>
                                    ))}
                                    {employeesList.length === 0 && <div className="text-center p-8 text-sm text-slate-400 font-medium">No available employee</div>}
                                </div>
                            </div>
                            
                            {/* Right Column: Selected Employees */}
                            <div className="flex-1 flex flex-col bg-slate-50/50">
                                <div className="p-4 border-b border-t sm:border-t-0 border-slate-100 flex justify-between items-center bg-white">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected</span>
                                    <button 
                                        onClick={() => setSelectedEmployees([])}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                                    >Remove all</button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                                    {selectedEmployees.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                            <span className="text-sm font-bold">No available employee</span>
                                        </div>
                                    ) : (
                                        employeesList.filter(e => selectedEmployees.includes(e.id)).map(emp => (
                                            <div key={emp.id} className="flex items-center justify-between p-2 hover:bg-white rounded-xl group transition-colors border border-transparent hover:border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{emp.name.charAt(0)}</div>
                                                    <span className="text-sm font-bold text-slate-700">{emp.name}</span>
                                                </div>
                                                <button onClick={() => setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id))} className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                
                                <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                                    <button onClick={() => setShowEmployeeModal(false)} className="px-6 py-2 rounded-xl text-sm font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-all">Cancel</button>
                                    <button onClick={() => setShowEmployeeModal(false)} className="px-6 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
`;

content = content.replace('        </>\n    );\n}', employeeModalCode + '\n        </>\n    );\n}');

fs.writeFileSync(file, content);
console.log('Update Complete.');
