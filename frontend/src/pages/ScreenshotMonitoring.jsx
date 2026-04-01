
import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import {
  Grid,
  List,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  Download,
  Trash2,
  Clock,
  ChevronDown,
  Search,
  CheckCircle2,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Settings,
  Shield,
  Camera,
  RefreshCw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Globe,
  User,
  Users,
  Monitor,
  Folder,
  CheckSquare,
  Tag,
  PieChart,
  Video,
  FileVideo,
  HardDrive
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRealTime } from '../hooks/RealTimeContext';
import { useAuthStore } from '../store/authStore';
import screenshotService from '../services/screenshotService';
import API_BASE_URL from '../config/api';

const cn = (...inputs) => twMerge(clsx(inputs));

// ─── Live Stream Viewer Component ───────────────────────────────────────────
const LiveStreamModal = memo(({ isOpen, onClose, employee, socket }) => {
  const { employees: contextEmployees } = useRealTime();
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const senderSocketIdRef = useRef(null);
  const [status, setStatus] = useState('Connecting...');

  // Proactive status check
  const isEmployeeOnline = useMemo(() => {
    if (!employee || !contextEmployees) return false;
    const emp = contextEmployees.find(e => e.id === employee.id);
    return emp?.status === 'online' || emp?.status === 'idle';
  }, [employee, contextEmployees]);

  useEffect(() => {
    if (!isOpen || !socket || !employee) return;
    
    // If proactively offline, don't even start WebRTC
    if (!isEmployeeOnline) {
      setStatus('OFFLINE');
      return;
    }

    let isEstablished = false;
    const timeout = setTimeout(() => {
        if (!isEstablished) setStatus('Offline or Not Sharing');
    }, 15000);

    console.log('[WebRTC] Starting receiver for:', employee.name);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    pcRef.current = pc;

    pc.ontrack = (event) => {
      console.log('[WebRTC] Received track');
      isEstablished = true;
      clearTimeout(timeout);
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
        setStatus('Live');
      }
    };

    const handleOffer = async ({ employeeId, offer, fromId }) => {
      if (employeeId !== employee.id) return;
      console.log('[WebRTC] Received offer from:', fromId);
      senderSocketIdRef.current = fromId;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('live:answer', { employeeId, answer, targetId: fromId });
      } catch (err) {
        console.error('[WebRTC] Offer handling failed:', err);
      }
    };

    const handleCandidate = async ({ employeeId, candidate }) => {
        if (employeeId !== employee.id) return;
        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
            console.error('[WebRTC] Candidate handling failed:', err);
        }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && senderSocketIdRef.current) {
        socket.emit('live:candidate', { 
            targetId: senderSocketIdRef.current, 
            candidate: event.candidate, 
            forEmployeeId: employee.id 
        });
      }
    };

    socket.on('live:offer', handleOffer);
    socket.on('live:candidate', handleCandidate);

    // Initial request
    socket.emit('live:request', { employeeId: employee.id });

    return () => {
      clearTimeout(timeout);
      socket.off('live:offer', handleOffer);
      socket.off('live:candidate', handleCandidate);
      pc.close();
      pcRef.current = null;
    };
  }, [isOpen, socket, employee, isEmployeeOnline]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 w-full max-w-5xl shadow-2xl relative animate-scale-in">
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                    <div className={cn("h-2 w-2 rounded-full", status === 'Live' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500')} />
                    <span className="text-white text-xs font-black uppercase tracking-widest">{status}</span>
                    <div className="h-4 w-[1px] bg-white/20 mx-1" />
                    <span className="text-white/70 text-xs font-bold">{employee.name}</span>
                </div>
                <button onClick={onClose} className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-all">
                    <X size={20} />
                </button>
            </div>
            <video ref={videoRef} autoPlay playsInline className="w-full aspect-video object-contain bg-black rounded-lg" />
            {status !== 'Live' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <Monitor className="h-12 w-12 text-slate-700 mx-auto mb-4 animate-pulse" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{status}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
});

// --- Components ---
const FilterButton = memo(({ active, label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
      active
        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md transform scale-105"
        : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
    )}
  >
    {Icon && <Icon size={14} />}
    {label}
  </button>
));

FilterButton.displayName = 'FilterButton';

const ToggleSwitch = memo(({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between w-full bg-white dark:bg-slate-900 p-3 sm:p-2 sm:pr-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[44px]">
    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative h-6 w-10 flex-shrink-0 rounded-full transition-colors duration-300 focus:outline-none",
        enabled ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
      )}
    >
      <span
        className={cn(
          "block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300",
          enabled ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  </div>
));

ToggleSwitch.displayName = 'ToggleSwitch';

// Keep static utility lists for filter labels only
const appsList = [
  { id: 1, name: "Chrome" },
  { id: 2, name: "VS Code" },
  { id: 3, name: "Figma" },
  { id: 4, name: "Slack" },
  { id: 5, name: "Excel" }
];

const tasksList = [
  { id: 1, name: "Development" },
  { id: 2, name: "Meeting" },
  { id: 3, name: "Design" },
  { id: 4, name: "Documentation" }
];

const screenshotTypesList = [
  { id: 1, name: "Automatic" },
  { id: 2, name: "Manual" }
];

const productivityTypesList = [
  { id: 1, name: "Productive" },
  { id: 2, name: "Neutral" },
  { id: 3, name: "Unproductive" }
];

const categoryList = [
  { id: 1, name: "Work" },
  { id: 2, name: "Break" },
  { id: 3, name: "Personal" }
];

const ScreenshotCard = memo(({ id, employeeId, employee, timestamp, image, isBlurred, app, productivity, onDelete, viewMode, onDownload, globalBlur, onView, onViewLive, project, task, team, category, type, onBlurToggle }) => {
  const [localBlur, setLocalBlur] = useState(isBlurred);
  const effectiveBlur = globalBlur || localBlur;
  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleView = useCallback(() => {
    onView({ id, time, url: image, isBlurred, employee, localBlur, effectiveBlur, app, productivity });
  }, [onView, id, time, image, isBlurred, employee, localBlur, effectiveBlur, app, productivity]);

  const handleBlurToggle = useCallback(async (e) => {
    e.stopPropagation();
    setLocalBlur(prev => !prev);
    // Persist blur state to backend
    if (onBlurToggle) onBlurToggle(id);
  }, [id, onBlurToggle]);

  const handleDownloadClick = useCallback((e) => {
    e.stopPropagation();
    onDownload(image);
  }, [onDownload, image]);

  const handleLiveClick = useCallback((e) => {
    e.stopPropagation();
    onViewLive({ id: employeeId, name: employee });
  }, [onViewLive, employeeId, employee]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    onDelete(id);
  }, [onDelete, id]);

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleView}
        className="group flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 hover:shadow-lg transition-all duration-300 hover:-translate-x-1 cursor-pointer"
      >
        <div className="relative h-16 aspect-video rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 mr-4 border border-slate-100 dark:border-slate-700 flex-shrink-0">
          <img
            src={image}
            alt={time}
            loading="lazy"
            className={cn("h-full w-full object-cover transition-all", effectiveBlur && "blur-md scale-110")}
          />
          {effectiveBlur && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield size={10} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500 dark:text-slate-400">
                {employee ? employee.charAt(0) : 'A'}
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{employee}</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-700">{time}</span>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">{app}</span>
          </div>
          <div>
            <span className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
              productivity === 'productive' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                productivity === 'unproductive' ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' :
                  'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
            )}>
              {productivity}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity px-1 sm:px-2" onClick={e => e.stopPropagation()}>
          <button onClick={handleBlurToggle} className="p-2 sm:p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            {localBlur ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button onClick={handleLiveClick} className="p-2 sm:p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-500 transition-colors">
            <Video size={16} />
          </button>
          <button onClick={handleDownloadClick} className="p-2 sm:p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <Download size={16} />
          </button>
          <div className="hidden sm:block h-4 w-[1px] bg-slate-100 dark:bg-slate-800 mx-1" />
          <button onClick={handleDeleteClick} className="p-2 sm:p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleView}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-50 dark:bg-slate-800">
        <img
          src={image}
          alt={`Screenshot at ${time}`}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-all duration-700",
            effectiveBlur ? "blur-xl scale-110 opacity-80" : "group-hover:scale-105"
          )}
        />
        {effectiveBlur && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 dark:bg-white/90 backdrop-blur-md rounded-full text-white dark:text-slate-900 shadow-lg">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Privacy Blur</span>
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
          <div className="flex items-center justify-between translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex gap-2">
              <button
                onClick={handleLiveClick}
                className="h-9 w-9 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-rose-500 hover:bg-rose-600 text-white backdrop-blur-sm transition-colors"
                title="View Live"
              >
                <Video size={16} />
              </button>
              <button
                onClick={handleBlurToggle}
                className="h-9 w-9 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
                title={localBlur ? "Reveal" : "Blur"}
              >
                {localBlur ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={handleDownloadClick}
                className="h-9 w-9 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
            </div>
            <button
              onClick={handleDeleteClick}
              className="h-9 w-9 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-sm transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-900 relative z-20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {employee ? employee.charAt(0) : 'A'}
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{employee || "Unknown"}</p>
          </div>
          <span className="text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
            {time}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate mr-2">{app}</span>
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
            productivity === 'productive' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
              productivity === 'unproductive' ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' :
                'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
          )}>
            {productivity}
          </span>
        </div>
      </div>
    </div>
  );
});

ScreenshotCard.displayName = 'ScreenshotCard';

// --- Generic Selection Modal (Reusable for all filters) ---
const GenericSelectionModal = memo(({
  isOpen,
  onClose,
  title,
  items,
  selectedIds,
  onSelectionChange,
  placeholder = "Search",
  emptyMessage = "No available item"
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState(selectedIds);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    setTempSelected(items.map(i => i.id));
  };

  const handleRemoveAll = () => {
    setTempSelected([]);
  };

  const handleToggleItem = (itemId) => {
    setTempSelected(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDone = () => {
    onSelectionChange(tempSelected);
    onClose();
  };

  const handleCancel = () => {
    setTempSelected(selectedIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Left Panel - Available Items */}
          <div className="flex-1 border-r border-slate-200 dark:border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-[#fcfdfe] dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{title}</span>
              </div>
              <button
                onClick={handleSelectAll}
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Select all
              </button>
            </div>
            <div className="p-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-500/20"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleToggleItem(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                        tempSelected.includes(item.id)
                          ? "bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                      )}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                        tempSelected.includes(item.id)
                          ? "bg-primary-600 dark:bg-primary-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      )}>
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{item.name}</p>
                      </div>
                      {tempSelected.includes(item.id) && (
                        <Check size={16} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="h-16 w-16 mb-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-600">
                      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                      <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500">{emptyMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Selected Items */}
          <div className="flex-1 flex flex-col bg-[#fcfdfe] dark:bg-slate-800/30">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">SELECTED</span>
              </div>
              <button
                onClick={handleRemoveAll}
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Remove all
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {tempSelected.length > 0 ? (
                <div className="space-y-1">
                  {items.filter(i => tempSelected.includes(i.id)).map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleToggleItem(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left bg-white dark:bg-slate-900 shadow-sm"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{item.name}</p>
                      </div>
                      <X size={16} className="text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500">No available {title.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-[#fcfdfe] dark:bg-slate-800/50 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-6 py-2.5 bg-primary-600 dark:bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-700 dark:hover:bg-primary-600 transition-all shadow-lg shadow-primary-600/20 dark:shadow-primary-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
});

GenericSelectionModal.displayName = 'GenericSelectionModal';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isEmployee }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-600">
            <Trash2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Screenshot?</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {isEmployee 
                ? "This will hide it from your view, but it may still be visible to admins." 
                : "This will permanently remove the screenshot from the database and disk."}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 translate-y-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export function ScreenshotMonitoring() {
    const { user, role } = useAuthStore();
    const { socket, employees: contextEmployees, teams: contextTeams, projects: contextProjects, screenshots: contextScreenshots, deleteScreenshot, addNotification } = useRealTime();
    
    // Live Monitoring State
    const [viewingLiveEmployee, setViewingLiveEmployee] = useState(null);
    const [backendScreenshots, setBackendScreenshots] = useState([]);
    const [videoRecordings, setVideoRecordings] = useState([]);
    const [loadingVideos, setLoadingVideos] = useState(false);

  // Sync context screenshots (newly arrived via socket) to local state
  useEffect(() => {
    if (contextScreenshots && contextScreenshots.length > 0) {
        setBackendScreenshots(prev => {
            const newOnes = contextScreenshots.filter(cs => !prev.some(ps => ps.id === cs.id));
            if (newOnes.length === 0) return prev;
            return [...newOnes, ...prev];
        });
    }
  }, [contextScreenshots]);
  const [loadingScreenshots, setLoadingScreenshots] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;


  // Derived employee list from real backend data
  const employeesList = useMemo(() =>
    contextEmployees.filter(e => !e.isSeed).map(e => ({ id: e.id, name: e.name || e.fullName })),
    [contextEmployees]
  );

  // Derived teams list from real backend data
  const teamsList = useMemo(() =>
    contextTeams.filter(t => !t.isSeed).map(t => ({ id: t.id, name: t.name })),
    [contextTeams]
  );

  // Derived projects list from real backend data
  const projectsList = useMemo(() =>
    contextProjects.map(p => ({ id: p.id, name: p.name })),
    [contextProjects]
  );

  // State for new controls
  const [randomScreenshots, setRandomScreenshots] = useState(true);
  const [globalBlur, setGlobalBlur] = useState(false);
  const [frequency, setFrequency] = useState('10m');
  const [captureRule, setCaptureRule] = useState('All Apps');
  const [excludeSensitive, setExcludeSensitive] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // Fetch Screenshot Settings
  const fetchSettings = useCallback(async () => {
    try {
      const res = await screenshotService.getSettings();
      if (res.success && res.data) {
        setRandomScreenshots(res.data.randomShifts);
        setExcludeSensitive(res.data.excludeAdmin);
        setGlobalBlur(res.data.globalBlur);
        setFrequency(`${res.data.frequency}m`);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  }, []);

  const updateSetting = async (key, value) => {
    try {
      // Map local state keys to backend schema keys
      const backendKeyMap = {
        randomScreenshots: 'randomShifts',
        excludeSensitive: 'excludeAdmin',
        globalBlur: 'globalBlur',
        frequency: 'frequency'
      };

      const backendKey = backendKeyMap[key] || key;
      let finalValue = value;
      
      // Handle frequency conversion (e.g., '10m' -> 10)
      if (key === 'frequency') {
        finalValue = parseInt(value) || 5;
      }

      await screenshotService.updateSettings({ [backendKey]: finalValue });
      if (addNotification) addNotification('Success', 'Setting updated', 'success');
    } catch (err) {
      console.error('Failed to update setting:', err);
    }
  };

  // View & Filter State
  const [viewMode, setViewMode] = useState('grid');
  const [timelineDate, setTimelineDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

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

  // Generic Filter Modal State
  const [activeFilterModal, setActiveFilterModal] = useState(null); // 'employees', 'teams', 'projects', etc.

  // Selected Filters State (Stores IDs)
  const [selectedFilters, setSelectedFilters] = useState({
    employees: [],
    teams: [],
    projects: [],
    apps: [],
    tasks: [],
    screenshotTypes: [],
    productivityTypes: [],
    category: []
  });

  // Deletion Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [screenshotToDelete, setScreenshotToDelete] = useState(null);

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

  const [showAddFilter, setShowAddFilter] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState(null);
  const [selectedFilterValue, setSelectedFilterValue] = useState('');

  // Use backend screenshots as the primary source
  const localScreenshots = useMemo(() => {
    let filtered = backendScreenshots;
    
    // We only want to show REAL screenshots (ignore simulator dummy Picsum data)
    // Filter out screenshots that don't start with /uploads or aren't blob URLs
    filtered = filtered.filter(s => s.imageUrl?.startsWith('/uploads') || s.imageUrl?.startsWith('blob:'));

    return filtered.map(s => ({
      ...s,
      id: s.id,
      employee: s.employee?.fullName || s.employee || 'Unknown',
      team: s.employee?.team?.name || 'General',
      image: s.imageUrl?.startsWith('/') ? `${API_BASE_URL.replace(/\/api\/?$/, '')}${s.imageUrl}` : s.imageUrl,
      timestamp: s.capturedAt || s.createdAt,
      productivity: (s.productivity || 'NEUTRAL').toLowerCase(),
      isBlurred: s.blurred || false,
      type: 'automatic',
    }));
  }, [backendScreenshots, role]);

  const setLocalScreenshots = () => { }; // No-op — we'll reload from backend

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(employeeSearchQuery), 300);
    return () => clearTimeout(timer);
  }, [employeeSearchQuery]);

  // Functional states for modals
  const [showRestrictedApps, setShowRestrictedApps] = useState(false);
  const [showCaptureRules, setShowCaptureRules] = useState(false);
  const [restrictedApps, setRestrictedApps] = useState(['Telegram', 'WhatsApp', 'Facebook', 'Steam']);
  const [newApp, setNewApp] = useState('');
  const [rules, setRules] = useState([
    { id: 1, name: 'Work Hours Only', enabled: true, desc: '9 AM - 6 PM' },
    { id: 2, name: 'Keypad Monitoring', enabled: false, desc: 'Capture on activity' },
    { id: 3, name: 'Idle Timeout', enabled: true, desc: 'Pause after 5m idle' },
  ]);

  // Detail View & Archive State
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [isLoadingArchive, setIsLoadingArchive] = useState(false);

  // 2. Filter & Derived Logic (Optimized with useMemo)
  const uniqueEmployees = useMemo(() => ['All', ...new Set(localScreenshots.map(s => s.employee))], [localScreenshots]);

  const filteredScreenshots = useMemo(() => {
    let result = localScreenshots.filter(s => {
      // Generic Filter Logic based on selectedFilters state
      if (selectedFilters.employees.length > 0 && !selectedFilters.employees.includes(s.employeeId)) return false;
      if (selectedFilters.teams.length > 0 && !selectedFilters.teams.some(tid => s.team?.toLowerCase().includes(contextTeams.find(t => t.id === tid)?.name.toLowerCase() || ''))) return false;
      if (selectedFilters.projects.length > 0 && !selectedFilters.projects.some(pid => s.project?.toLowerCase().includes(contextProjects.find(p => p.id === pid)?.name.toLowerCase() || ''))) return false;
      if (selectedFilters.apps.length > 0 && !selectedFilters.apps.some(aid => s.app?.toLowerCase().includes(appsList.find(a => a.id === aid)?.name.toLowerCase() || ''))) return false;
      if (selectedFilters.tasks.length > 0 && !selectedFilters.tasks.some(tid => s.task?.toLowerCase().includes(tasksList.find(t => t.id === tid)?.name.toLowerCase() || ''))) return false;
      if (selectedFilters.screenshotTypes.length > 0 && !selectedFilters.screenshotTypes.includes(s.type)) return false;
      if (selectedFilters.productivityTypes.length > 0 && !selectedFilters.productivityTypes.includes(s.productivity)) return false;
      if (selectedFilters.category.length > 0 && !selectedFilters.category.includes(s.category)) return false;

      // Apply preset filter
      const sDate = new Date(s.timestamp || s.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedPreset === 'Today') {
        if (sDate < today) return false;
      } else if (selectedPreset === 'Yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (sDate < yesterday || sDate >= today) return false;
      } else if (selectedPreset === 'This Week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        if (sDate < startOfWeek) return false;
      } else if (selectedPreset === 'Last 7 Days') {
        const last7 = new Date(today);
        last7.setDate(today.getDate() - 7);
        if (sDate < last7) return false;
      } else if (selectedPreset === 'This Month') {
        if (sDate.getMonth() !== today.getMonth() || sDate.getFullYear() !== today.getFullYear()) return false;
      }

      // Text search (Search bar)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          s.employee?.toLowerCase().includes(q) ||
          s.app?.toLowerCase().includes(q) ||
          s.project?.toLowerCase().includes(q) ||
          s.task?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Dropdown Filter Category
      if (selectedFilterCategory && selectedFilterValue) {
        const val = selectedFilterValue.toLowerCase();
        if (selectedFilterCategory === 'Employees' && !s.employee?.toLowerCase().includes(val)) return false;
        if (selectedFilterCategory === 'Teams' && !s.team?.toLowerCase().includes(val)) return false;
        if (selectedFilterCategory === 'Apps & Websites' && !s.app?.toLowerCase().includes(val)) return false;
        if (selectedFilterCategory === 'Projects' && !s.project?.toLowerCase().includes(val)) return false;
        if (selectedFilterCategory === 'Tasks' && !s.task?.toLowerCase().includes(val)) return false;
        if (selectedFilterCategory === 'Category' && !s.category?.toLowerCase().includes(val)) return false;
        if (selectedFilterCategory === 'Screenshot types' && !s.type?.toLowerCase().includes(val)) return false;
        if (selectedFilterCategory === 'Productivity types' && !s.productivity?.toLowerCase().includes(val)) return false;
      }

      // Quick Filters
      if (selectedEmployee !== 'All' && s.employee !== selectedEmployee) return false;
      if (activeFilter === 'Flagged' && !s.isBlurred) return false;
      if (activeFilter === 'Idle' && s.productivity !== 'unproductive') return false;
      if (excludeSensitive && s.employee === 'John Doe') return false;

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date).getTime();
      const timeB = new Date(b.timestamp || b.date).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [localScreenshots, selectedEmployee, activeFilter, excludeSensitive, selectedPreset, sortOrder, searchQuery, selectedFilterCategory, selectedFilterValue, selectedFilters]);

  const progress = useMemo(() =>
    filteredScreenshots.length > 0 ? ((playbackIndex + 1) / filteredScreenshots.length) * 100 : 0
    , [playbackIndex, filteredScreenshots]);

  const currentPlaybackTime = useMemo(() =>
    filteredScreenshots[playbackIndex]?.time || "09:00 AM"
    , [playbackIndex, filteredScreenshots]);

  // 3. Optimized Handlers (useCallback)
  const handleCloseModal = useCallback(() => {
    setSelectedScreenshot(null);
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    if (filteredScreenshots.length === 0) return;
    const nextIndex = (playbackIndex + 1) % filteredScreenshots.length;
    setPlaybackIndex(nextIndex);
    const nextItem = filteredScreenshots[nextIndex];
    setSelectedScreenshot({
      ...nextItem,
      effectiveBlur: globalBlur || nextItem.isBlurred
    });
  }, [filteredScreenshots, playbackIndex, globalBlur]);

  const handlePrev = useCallback(() => {
    if (filteredScreenshots.length === 0) return;
    const prevIndex = (playbackIndex - 1 + filteredScreenshots.length) % filteredScreenshots.length;
    setPlaybackIndex(prevIndex);
    const prevItem = filteredScreenshots[prevIndex];
    setSelectedScreenshot({
      ...prevItem,
      effectiveBlur: globalBlur || prevItem.isBlurred
    });
  }, [filteredScreenshots, playbackIndex, globalBlur]);

  const handleLoadArchive = useCallback(async () => {
    if (isLoadingArchive) return;
    setIsLoadingArchive(true);
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    try {
      await delay(800);
      const year = timelineDate.getFullYear();
      const month = String(timelineDate.getMonth() + 1).padStart(2, '0');
      const day = String(timelineDate.getDate()).padStart(2, '0');
      const targetDateStr = `${year}-${month}-${day}`;
      const batchSize = 10;
      const archiveData = Array.from({ length: batchSize }).map((_, i) => ({
        id: `arc-${Date.now()}-${i}`,
        id_val: `arc-${Date.now()}-${i}`,
        time: `${8 + Math.floor(i / 2)}:${(i % 2) * 30 + 10} AM`,
        date: targetDateStr,
        url: `https://picsum.photos/seed/${Math.random()}/800/450`,
        employee: ['Sarah Brown', 'Alex Johnson', 'Mike Wilson', 'John Doe'][Math.floor(Math.random() * 4)],
        isBlurred: Math.random() > 0.7,
        status: Math.random() > 0.8 ? 'Idle' : 'Active',
        department: 'Engineering',
        employeeId: Math.floor(Math.random() * 4) + 1
      }));
      setLocalScreenshots(prev => [...archiveData, ...prev]);
    } finally {
      setIsLoadingArchive(false);
    }
  }, [isLoadingArchive, timelineDate]);

  const handleDelete = useCallback((id) => {
    setScreenshotToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!screenshotToDelete) return;
    try {
        await deleteScreenshot(screenshotToDelete);
        setBackendScreenshots(prev => prev.filter(s => s.id !== screenshotToDelete));
        setIsDeleteModalOpen(false);
        setScreenshotToDelete(null);
        if (addNotification) addNotification('Success', 'Screenshot deleted successfully', 'success');
    } catch (err) {
        console.error('Failed to delete screenshot:', err);
        if (addNotification) addNotification('Error', 'Failed to delete screenshot', 'error');
    }
  }, [deleteScreenshot, screenshotToDelete, addNotification]);

  const handleBlurToggleBackend = useCallback(async (id) => {
    try {
      await screenshotService.toggleBlur(id);
      // Update local state to reflect change
      setBackendScreenshots(prev => prev.map(s => s.id === id ? { ...s, blurred: !s.blurred } : s));
    } catch (err) {
      console.error('Failed to toggle blur:', err);
    }
  }, []);

  const handleDownload = useCallback(async (url) => {
    if (!url) return;
    try {
      const baseUrl = API_BASE_URL.replace('/api', '');
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
      
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop() || 'screenshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      if (addNotification) addNotification('Downloading...', 'Your screenshot download has started.', 'info');
    } catch (err) {
      console.error('Download failed:', err);
      if (addNotification) addNotification('Error', 'Failed to download screenshot. Check your connection.', 'error');
    }
  }, [addNotification]);

  const handleViewScreenshot = useCallback((screenshot, index) => {
    setPlaybackIndex(index);
    setSelectedScreenshot({
      ...screenshot,
      effectiveBlur: globalBlur || screenshot.isBlurred
    });
  }, [globalBlur]);

  const handleDateSelect = useCallback((date) => {
    if (date > new Date()) return;
    setTimelineDate(new Date(date));
    setShowCalendar(false);
    setPlaybackIndex(0);
    setIsPlaying(false);
  }, []);

  const handleCaptureRealScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      await new Promise(resolve => { video.onplaying = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      stream.getTracks().forEach(track => track.stop());

      canvas.toBlob(async (blob) => {
        if (!blob) return;
         const formData = new FormData();
         formData.append('image', blob, 'real-screenshot.png');
         
         const validEmployeeId = employeesList.length > 0 ? employeesList[0].id : 
                                 (contextEmployees.length > 0 ? contextEmployees[0].id : null);
         
         if (!validEmployeeId) {
             alert('No employees found in the system to attach this screenshot to!');
             return;
         }

         formData.append('employeeId', validEmployeeId);
         formData.append('productivity', 'PRODUCTIVE');
         
         const res = await screenshotService.uploadRealScreenshot(formData);
         if (res && res.success) {
             if (addNotification) addNotification('Success', 'Real screenshot uploaded as WebP!', 'success');
             fetchScreenshots(0);
         } else {
             alert(res.message || 'Error saving screenshot.');
         }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to capture screen:', err);
    }
  };

  const isToday = timelineDate.toDateString() === new Date().toDateString();

  // Fetch real screenshots from backend
  const fetchScreenshots = useCallback(async (pageNum = 0, isPolling = false) => {
    if (!isPolling) setLoadingScreenshots(true);
    try {
      const res = await screenshotService.getScreenshots({ limit, offset: pageNum * limit });
      if (res.success && res.data) {
        if (res.data.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setBackendScreenshots(prev => {
          if (pageNum === 0) {
             const newOnes = res.data.filter(rd => !prev.some(p => p.id === rd.id));
             return [...newOnes, ...prev];
          }
          return [...prev, ...res.data];
        });
      }
    } catch (err) {
      console.error('Failed to fetch screenshots:', err);
    } finally {
      setLoadingScreenshots(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchScreenshots(0);
    fetchSettings();
    // Refresh every minute to pick up simulator-generated screenshots
    const interval = setInterval(() => fetchScreenshots(0, true), 60000);
    return () => clearInterval(interval);
  }, [fetchScreenshots, fetchSettings]);

  // Fetch video recordings (admin/manager only)
  useEffect(() => {
    if (role === 'EMPLOYEE') return;
    const fetchVideos = async () => {
      setLoadingVideos(true);
      try {
        const res = await videoService.getVideos({ limit: 50 });
        if (res.success && res.data) setVideoRecordings(res.data);
      } catch (err) {
        console.error('Failed to fetch videos:', err);
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
    const interval = setInterval(fetchVideos, 60000);
    return () => clearInterval(interval);
  }, [role]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchScreenshots(nextPage);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedScreenshot) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleCloseModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedScreenshot, handleNext, handlePrev, handleCloseModal]);

  // Playback Logic
  useEffect(() => {
    let interval;
    if (isPlaying && filteredScreenshots.length > 0) {
      // Auto-open modal on first play if not already open
      const currentItem = filteredScreenshots[playbackIndex];
      if (currentItem) {
        setSelectedScreenshot({
          ...currentItem,
          effectiveBlur: globalBlur || currentItem.isBlurred
        });
      }

      interval = setInterval(() => {
        setPlaybackIndex((prev) => {
          const next = prev + 1;
          if (next >= filteredScreenshots.length) {
            setIsPlaying(false);
            setSelectedScreenshot(null); // Close modal when finished
            return 0;
          }
          // Update modal content for next item
          const nextItem = filteredScreenshots[next];
          if (nextItem) {
            setSelectedScreenshot({
              ...nextItem,
              effectiveBlur: globalBlur || nextItem.isBlurred
            });
          }
          return next;
        });
      }, 2000); // 2 seconds per slide for better visibility in modal
    }
    return () => clearInterval(interval);
  }, [isPlaying, filteredScreenshots, globalBlur]);

  const handleClearFilter = (filterType) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: []
    }));
  };

  const handleFilterSelection = (filterType, selectedIds) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: selectedIds
    }));
  };

  const getFilterLabel = (type) => {
    switch (type) {
      case 'employees': return 'Employees';
      case 'teams': return 'Teams';
      case 'projects': return 'Projects';
      case 'apps': return 'Apps';
      case 'tasks': return 'Tasks';
      case 'screenshotTypes': return 'Types';
      case 'productivityTypes': return 'Productivity';
      case 'category': return 'Category';
      default: return 'Filter';
    }
  };

  const getFilterList = (type) => {
    switch (type) {
      case 'employees': return employeesList;
      case 'teams': return teamsList;
      case 'projects': return projectsList;
      case 'apps': return appsList;
      case 'tasks': return tasksList;
      case 'screenshotTypes': return screenshotTypesList;
      case 'productivityTypes': return productivityTypesList;
      case 'category': return categoryList;
      default: return [];
    }
  };

  const getEmptyMessage = (type) => {
    switch (type) {
      case 'employees': return 'No available employee';
      case 'teams': return 'No available team';
      case 'projects': return 'No available project';
      case 'apps': return 'No available app';
      case 'tasks': return 'No available task';
      case 'screenshotTypes': return 'No available type';
      case 'productivityTypes': return 'No available productivity type';
      case 'category': return 'No available category';
      default: return 'No available item';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#fcfdfe] dark:bg-slate-950 space-y-6 sm:space-y-8 pb-20 px-2 sm:px-4 lg:px-8 max-w-full overflow-x-hidden box-border animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Screenshots</h1>
          </div>

          {/* Top Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {role !== 'EMPLOYEE' && (
              <button
                onClick={handleCaptureRealScreen}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                title="Capture and upload your actual screen as a demo"
              >
                <Camera size={16} />
                <span>Capture Real Screen</span>
              </button>
            )}

            {/* Active Filter Tags */}
            {Object.entries(selectedFilters).map(([key, value]) => {
              if (value.length === 0) return null;
              return (
                <div key={key} className="flex items-center gap-2 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 rounded-xl px-3 py-2 shadow-sm animate-in fade-in zoom-in duration-200">
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-400">{getFilterLabel(key)} <span className="text-primary-400 dark:text-primary-500">({value.length})</span></span>
                  <button onClick={() => handleClearFilter(key)} className="p-0.5 hover:bg-primary-200 dark:hover:bg-primary-500/20 rounded-md text-primary-400 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              );
            })}

            {/* Add Filter Dropdown */}
            {role !== 'EMPLOYEE' && (
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowAddFilterDropdown(!showAddFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all shadow-sm"
                >
                  <Plus size={16} />
                  <span>Add Filter</span>
                </button>

                {showAddFilterDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200 origin-top-left">
                    <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 mb-1">Filter By</div>
                    {[
                      { id: 'employees', label: 'Employees' },
                      { id: 'teams', label: 'Teams' },
                      { id: 'apps', label: 'Apps & Websites' },
                      { id: 'projects', label: 'Projects' },
                      { id: 'tasks', label: 'Tasks' },
                      { id: 'screenshotTypes', label: 'Screenshot types' },
                      { id: 'productivityTypes', label: 'Productivity types' },
                      { id: 'category', label: 'Category' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setActiveFilterModal(f.id);
                          setShowAddFilterDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-colors"
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="relative ml-auto">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Empty State or Content */}
        {filteredScreenshots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="w-48 h-48 mb-6">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
                <circle cx="85" cy="90" r="5" fill="#94A3B8" />
                <circle cx="115" cy="90" r="5" fill="#94A3B8" />
                <path d="M 85 115 Q 100 125 115 115" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                <path d="M 130 130 L 160 160" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
                <circle cx="165" cy="165" r="20" fill="none" stroke="#CBD5E1" strokeWidth="8" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 text-center">No screenshots found for the selected period</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-center max-w-md">
              Try to change the period or go to the settings and check if screenshots are enabled.
            </p>
          </div>
        ) : (
          <>
            {/* 2. Advanced Control Panel */}
            {role !== 'EMPLOYEE' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm w-full max-w-full overflow-hidden box-border">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Capture Settings</label>
                  <ToggleSwitch label="Random Shifts" enabled={randomScreenshots} onChange={(val) => { setRandomScreenshots(val); updateSetting('randomScreenshots', val); }} />
                  <ToggleSwitch label="Exclude Admin" enabled={excludeSensitive} onChange={(val) => { setExcludeSensitive(val); updateSetting('excludeSensitive', val); }} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Privacy & Security</label>
                  <ToggleSwitch label="Global Blur" enabled={globalBlur} onChange={(val) => { setGlobalBlur(val); updateSetting('globalBlur', val); }} />
                  <button
                    onClick={() => setShowRestrictedApps(true)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:ring-2 focus:ring-primary-500/10 min-h-[44px]"
                  >
                    <span>Restricted Apps</span>
                    <Settings size={14} className="text-slate-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Frequency</label>
                  <div className="relative w-full">
                    <select
                      value={frequency}
                      onChange={(e) => { setFrequency(e.target.value); updateSetting('frequency', e.target.value); }}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/10 cursor-pointer min-h-[44px]"
                    >
                      <option value="5m">Every 5 Mins</option>
                      <option value="10m">Every 10 Mins</option>
                      <option value="15m">Every 15 Mins</option>
                      <option value="30m">Every 30 Mins</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={() => setShowCaptureRules(true)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:ring-2 focus:ring-primary-500/10 min-h-[44px]"
                  >
                    <span>Capture Rules</span>
                    <Camera size={14} className="text-slate-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Quick Filters</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:flex sm:flex-wrap gap-2">
                    <div className="flex-1 sm:flex-none"><FilterButton label="All" active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} className="w-full justify-center" /></div>
                    <div className="flex-1 sm:flex-none"><FilterButton label="Flagged" active={activeFilter === 'Flagged'} onClick={() => setActiveFilter('Flagged')} icon={Shield} className="w-full justify-center" /></div>
                    <div className="flex-1 sm:flex-none"><FilterButton label="Idle" active={activeFilter === 'Idle'} onClick={() => setActiveFilter('Idle')} icon={Clock} className="w-full justify-center" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Timeline Playback */}
            {role !== 'EMPLOYEE' && (
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={cn(
                      "h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-2xl text-white shadow-lg transition-all active:scale-95 group",
                      isPlaying ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" : "bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 shadow-slate-900/20 dark:shadow-white/20"
                    )}
                  >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1 group-hover:scale-110 transition-transform" />}
                  </button>
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex flex-wrap items-center gap-2">
                          Playback Timeline
                          {selectedEmployee !== 'All' && <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{selectedEmployee}</span>}
                        </span>
                        <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white transition-all duration-300">
                          {currentPlaybackTime}
                        </span>
                      </div>
                      {isPlaying && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full animate-pulse flex-shrink-0">
                          <RefreshCw size={12} className="animate-spin" />
                          <span className="text-[10px] font-black uppercase whitespace-nowrap">Live Replay</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden cursor-pointer w-full"
                      title="Click to seek"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        const index = Math.floor(percentage * filteredScreenshots.length);
                        setPlaybackIndex(Math.min(index, filteredScreenshots.length - 1));
                        setIsPlaying(false);
                      }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-slate-900 dark:bg-white rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <span>Start</span>
                      <span className="hidden xs:block">Lunch Break</span>
                      <span>End Shift</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Screenshot Grid */}
            <div className={cn(
              "grid gap-6 transition-all duration-500",
              viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-4xl mx-auto"
            )}>
              {filteredScreenshots.map((s, index) => (
                <div key={s.id || s.id_val} className={cn("transition-all duration-500", isPlaying && index === playbackIndex && viewMode === 'grid' ? "scale-105 ring-4 ring-amber-500/20 rounded-2xl z-10" : "")}>
                  <ScreenshotCard
                    {...s}
                    viewMode={viewMode}
                    globalBlur={globalBlur}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    onBlurToggle={handleBlurToggleBackend}
                    onView={(data) => handleViewScreenshot(data, index)}
                    onViewLive={setViewingLiveEmployee}
                  />
                </div>
              ))}
            </div>

            {hasMore && filteredScreenshots.length > 0 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingScreenshots}
                  className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {loadingScreenshots ? <RefreshCw size={16} className="animate-spin" /> : <ChevronDown size={16} />}
                  <span>{loadingScreenshots ? 'Loading...' : 'Load More'}</span>
                </button>
              </div>
            )}

            {role !== 'EMPLOYEE' && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadArchive}
                  disabled={isLoadingArchive}
                  className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm flex items-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isLoadingArchive ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Accessing Cloud Storage...</span>
                    </>
                  ) : (
                    <span>Load Archive</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* ── Live Stream Viewer Modal ─────────────────────────────────────────── */}
      <LiveStreamModal
        isOpen={!!viewingLiveEmployee}
        onClose={() => setViewingLiveEmployee(null)}
        employee={viewingLiveEmployee}
        socket={socket}
      />

      {/* Generic Selection Modal (Handles all filter types) */}
      {activeFilterModal && (
        <GenericSelectionModal
          isOpen={!!activeFilterModal}
          onClose={() => setActiveFilterModal(null)}
          title={getFilterLabel(activeFilterModal).toUpperCase()}
          items={getFilterList(activeFilterModal)}
          selectedIds={selectedFilters[activeFilterModal]}
          onSelectionChange={(ids) => handleFilterSelection(activeFilterModal, ids)}
          placeholder="Search"
          emptyMessage={getEmptyMessage(activeFilterModal)}
        />
      )}

      {/* Restricted Apps Modal */}
      {showRestrictedApps && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[#fcfdfe] dark:bg-slate-800/50">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Restricted Apps</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Auto-pause tracking</p>
              </div>
              <button onClick={() => setShowRestrictedApps(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all">
                <X size={20} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Add app (e.g. Netflix)"
                  value={newApp}
                  onChange={(e) => setNewApp(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/10 min-h-[44px] text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                />
                <button
                  onClick={() => {
                    if (newApp) {
                      setRestrictedApps([...restrictedApps, newApp]);
                      setNewApp('');
                    }
                  }}
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all min-h-[44px]"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {restrictedApps.map(app => (
                  <div key={app} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 group">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{app}</span>
                    <button
                      onClick={() => setRestrictedApps(restrictedApps.filter(a => a !== app))}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-[#fcfdfe] dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setShowRestrictedApps(false)} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 dark:shadow-white/20 active:scale-95 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showCaptureRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[#fcfdfe] dark:bg-slate-800/50">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Capture Rules</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Global engine behavior</p>
              </div>
              <button onClick={() => setShowCaptureRules(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all">
                <X size={20} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {rules.map(rule => (
                <button
                  key={rule.id}
                  onClick={() => setRules(rules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                    rule.enabled ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 grayscale opacity-60"
                  )}
                >
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{rule.name}</h4>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{rule.desc}</p>
                  </div>
                  <div className={cn(
                    "h-6 w-11 rounded-full relative transition-all duration-300",
                    rule.enabled ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"
                  )}>
                    <div className={cn(
                      "absolute top-1 h-4 w-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                      rule.enabled ? "left-6" : "left-1"
                    )} />
                  </div>
                </button>
              ))}
            </div>
            <div className="p-6 bg-[#fcfdfe] dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setShowCaptureRules(false)} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 dark:shadow-white/20 active:scale-95 transition-all">Apply Policy</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Actions */}
            <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md flex-shrink-0">
                  {selectedScreenshot.employee.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-black text-base sm:text-lg leading-none mb-1 truncate">{selectedScreenshot.employee}</h3>
                  <p className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{selectedScreenshot.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleDownload(selectedScreenshot.image || selectedScreenshot.url)}
                  className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all backdrop-blur-md font-bold text-xs sm:text-sm"
                >
                  <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Download</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCloseModal(); }}
                  className="h-10 w-10 sm:h-12 sm:w-12 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all backdrop-blur-md cursor-pointer group flex-shrink-0"
                  title="Close View"
                >
                  <X size={20} className="sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center p-4 z-40 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="h-14 w-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all active:scale-90 pointer-events-auto"
              >
                <ChevronLeft size={32} />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center p-4 z-40 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="h-14 w-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-all active:scale-90 pointer-events-auto"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Image */}
            <img
              src={selectedScreenshot.image || selectedScreenshot.url || selectedScreenshot.imageUrl}
              alt="Full View"
              className={cn(
                "w-full h-full object-contain transition-all duration-1000",
                selectedScreenshot.effectiveBlur ? "blur-3xl scale-125 opacity-30" : "scale-100"
              )}
            />

            {/* Privacy Warning Overlay */}
            {selectedScreenshot.effectiveBlur && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="max-w-md text-center p-8 bg-black/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl">
                  <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <Shield size={40} className="text-emerald-400" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2 tracking-tight">Content Restricted</h4>
                  <p className="text-white/60 font-medium text-sm leading-relaxed mb-8">
                    This screenshot contains sensitive information and has been automatically blurred per company policy.
                  </p>
                  <button
                    onClick={() => setSelectedScreenshot({ ...selectedScreenshot, effectiveBlur: false })}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Override Blur (Audit Only)
                  </button>
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 z-30 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full sm:w-auto">
                <div className="min-w-0">
                  <p className="text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Active Window</p>
                  <p className="text-white font-bold text-xs sm:text-sm italic truncate">"Reviewing Quarter 3 Projections.xlsx"</p>
                </div>
                <div className="min-w-0">
                  <p className="text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">Total Process Time</p>
                  <p className="text-white font-bold text-xs sm:text-sm italic truncate">12 Minutes 45 Seconds</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 flex-shrink-0 self-end sm:self-auto">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white/80 text-[8px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Enterprise Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete}
        isEmployee={role === 'EMPLOYEE'}
      />
    </>
  );
}