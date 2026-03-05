import React, { useState, useRef, useEffect } from 'react';
import { X, MoreVertical, Plus, Check, Palette, GitMerge, Trash2 } from 'lucide-react';
import { useProductivityStore } from '../../store/productivityStore';
import { TagBadge } from './TagBadge';
import { cn } from '../../utils/cn';

const PRESET_COLORS = [
    '#F5A623', '#FF6B6B', '#FF4D4F', '#FFD666', '#9254DE',
    '#69C0FF', '#D3ADF7', '#52C41A', '#13C2C2', '#2F54EB',
    '#EB2F96', '#FA8C16', '#A0D911', '#08979C', '#1D39C4',
];

// ── Inline Color Picker ─────────────────────────────────────────────────────
function ColorPickerPopover({ currentColor, onSelect, onClose }) {
    return (
        <div className="absolute right-0 top-full mt-2 z-[300] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 w-52 animate-in fade-in zoom-in-95 duration-150">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Pick Color</p>
            <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_COLORS.map((c) => (
                    <button
                        key={c}
                        onClick={() => { onSelect(c); onClose(); }}
                        className="h-8 w-8 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center"
                        style={{ backgroundColor: c, borderColor: c === currentColor ? '#7c3aed' : 'transparent' }}
                    >
                        {c === currentColor && <Check size={12} color="white" strokeWidth={3} />}
                    </button>
                ))}
            </div>
            <input
                type="color"
                value={currentColor}
                onChange={(e) => onSelect(e.target.value)}
                className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
            />
        </div>
    );
}

// ── Tag Action Menu ──────────────────────────────────────────────────────────
function TagActionMenu({ tag, tags, onColorPick, onMerge, onDelete }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
                <MoreVertical size={16} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 z-[200] w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                        onClick={() => { onColorPick(tag.id); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        <Palette size={14} className="text-slate-400" /> Change color
                    </button>
                    <button
                        onClick={() => { onMerge(tag.id); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        <GitMerge size={14} className="text-slate-400" /> Merge
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800" />
                    <button
                        onClick={() => { onDelete(tag.id); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Merge Modal ───────────────────────────────────────────────────────────────
function MergeModal({ isOpen, sourceTag, tags, onMerge, onClose }) {
    const [targetId, setTargetId] = useState(null);
    if (!isOpen || !sourceTag) return null;
    const otherTags = tags.filter((t) => t.id !== sourceTag.id);

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-7 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">Merge Tag</h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-5">
                    Merge <strong>"{sourceTag.name}"</strong> into another tag. All assignments will transfer.
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto mb-6">
                    {otherTags.map((t) => (
                        <label key={t.id} className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all',
                            targetId === t.id ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10' : 'border-slate-200 dark:border-slate-700'
                        )}>
                            <input type="radio" name="mergeTarget" checked={targetId === t.id} onChange={() => setTargetId(t.id)} className="accent-violet-600" />
                            <TagBadge tag={t} />
                        </label>
                    ))}
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                    <button
                        disabled={!targetId}
                        onClick={() => { if (targetId) { onMerge(sourceTag.id, targetId); onClose(); } }}
                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none"
                    >
                        Merge
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteTagConfirm({ isOpen, tag, usageCount, onConfirm, onClose }) {
    if (!isOpen || !tag) return null;
    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-7 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5">
                    <Trash2 size={22} />
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Delete "{tag.name}"?</h2>
                {usageCount > 0 && (
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3">
                        ⚠ This tag is currently assigned to <strong>{usageCount}</strong> app{usageCount !== 1 ? 's' : ''}. They will become unassigned.
                    </p>
                )}
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-7">This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                    <button onClick={() => { onConfirm(tag.id); onClose(); }} className="flex-1 py-3 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all hover:scale-[1.02] active:scale-95">Delete</button>
                </div>
            </div>
        </div>
    );
}

// ── Main TagsDrawer ───────────────────────────────────────────────────────────
export function TagsDrawer({ isOpen, onClose }) {
    const { tags, addTag, updateTagColor, deleteTag, mergeTag, getTagUsageCount } = useProductivityStore();
    const [newTagName, setNewTagName] = useState('');
    const [newTagError, setNewTagError] = useState('');
    const [colorPickerFor, setColorPickerFor] = useState(null);
    const [mergeFor, setMergeFor] = useState(null);
    const [deleteFor, setDeleteFor] = useState(null);

    const handleAddTag = () => {
        const result = addTag(newTagName);
        if (result?.error) { setNewTagError(result.error); return; }
        setNewTagName('');
        setNewTagError('');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn('fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={cn(
                'fixed right-0 top-0 bottom-0 z-[110] w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out',
                isOpen ? 'translate-x-0' : 'translate-x-full'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Tags Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Add Tag Input */}
                <div className="px-6 pt-5 pb-3 shrink-0">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Insert name of new tag here"
                                value={newTagName}
                                onChange={(e) => { setNewTagName(e.target.value); setNewTagError(''); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                className={cn(
                                    'w-full h-11 px-4 rounded-xl border-2 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all',
                                    newTagError ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700 focus:border-violet-500'
                                )}
                            />
                            {newTagError && <p className="text-xs font-bold text-rose-500 mt-1">{newTagError}</p>}
                        </div>
                        <button onClick={handleAddTag} className="h-11 w-11 flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-violet-200 dark:shadow-none shrink-0">
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Tag List */}
                <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
                    {tags.map((tag) => (
                        <div key={tag.id} className="relative flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                            <TagBadge tag={tag} size="lg" />
                            <div className="flex items-center gap-1">
                                {colorPickerFor === tag.id && (
                                    <div className="relative">
                                        <ColorPickerPopover
                                            currentColor={tag.color}
                                            onSelect={(c) => updateTagColor(tag.id, c)}
                                            onClose={() => setColorPickerFor(null)}
                                        />
                                    </div>
                                )}
                                <TagActionMenu
                                    tag={tag}
                                    tags={tags}
                                    onColorPick={(id) => setColorPickerFor(colorPickerFor === id ? null : id)}
                                    onMerge={(id) => setMergeFor(id)}
                                    onDelete={(id) => setDeleteFor(id)}
                                />
                            </div>
                        </div>
                    ))}
                    {tags.length === 0 && (
                        <p className="text-center text-sm font-medium text-slate-400 py-12">No tags yet. Create one above!</p>
                    )}
                </div>
            </div>

            {/* Merge Modal */}
            <MergeModal
                isOpen={!!mergeFor}
                sourceTag={tags.find((t) => t.id === mergeFor)}
                tags={tags}
                onMerge={mergeTag}
                onClose={() => setMergeFor(null)}
            />

            {/* Delete Confirm */}
            <DeleteTagConfirm
                isOpen={!!deleteFor}
                tag={tags.find((t) => t.id === deleteFor)}
                usageCount={deleteFor ? getTagUsageCount(deleteFor) : 0}
                onConfirm={deleteTag}
                onClose={() => setDeleteFor(null)}
            />
        </>
    );
}
