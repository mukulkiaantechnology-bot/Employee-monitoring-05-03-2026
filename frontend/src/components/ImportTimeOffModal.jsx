import React, { useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { createPortal } from 'react-dom';

export const ImportTimeOffModal = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-700">Import Time Off</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-6 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-sm font-bold text-slate-700">Time Off</span>
                        <button className="text-xs font-black text-primary-600 hover:text-primary-700">Download Template</button>
                    </div>

                    <div className="aspect-[4/3] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group">
                        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-primary-500 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <Upload size={20} />
                        </div>
                        <p className="text-center">
                            <span className="text-primary-600 font-black">Upload a file</span>
                            <span className="text-slate-400 font-bold ml-1">or drag and drop here</span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-lg border border-primary-200 text-primary-600 font-black text-sm uppercase tracking-wider hover:bg-primary-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
