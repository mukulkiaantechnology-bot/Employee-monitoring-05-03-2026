import { create } from 'zustand';
import productivityService from '../services/productivityService';

const RANDOM_COLORS = ['#F5A623', '#FF6B6B', '#FF4D4F', '#FFD666', '#9254DE', '#69C0FF', '#D3ADF7', '#52C41A', '#13C2C2', '#2F54EB'];

export const useProductivityStore = create((set, get) => ({
    apps: [],
    tags: [],
    loading: false,
    error: null,
    filters: {
        organization: 'Organization',
        view: 'All apps & websites',
        thresholdEnabled: false,
        thresholdHours: 4,
        search: '',
        activeTag: null,
    },

    // ── Data fetching ────────────────────────────────────────────────
    fetchProductivityData: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const [apps, tags] = await Promise.all([
                productivityService.getApps(params),
                productivityService.getTags()
            ]);
            set({ apps, tags, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // ── App & Rule actions ──────────────────────────────────────────
    toggleSelectApp: (id) =>
        set((s) => ({
            apps: s.apps.map((a) => a.id === id ? { ...a, selected: !a.selected } : a),
        })),

    toggleSelectAll: (checked) =>
        set((s) => ({ apps: s.apps.map((a) => ({ ...a, selected: checked })) })),

    setAppTag: async (appId, tagId) => {
        try {
            const { apps } = get();
            const app = apps.find(a => a.id === appId);
            if (!app) return;

            // Update on backend
            await productivityService.updateRule({
                domain: app.domain,
                appName: app.appName,
                tagId: tagId
            });

            // Update locally
            set((s) => ({
                apps: s.apps.map((a) => a.id === appId ? { ...a, tagId } : a),
            }));
        } catch (error) {
            set({ error: error.message });
        }
    },

    autoLabel: async () => {
        const { apps, tags } = get();
        set({ loading: true });
        try {
            const AUTO_LABEL_RULES = [
                { keywords: ['youtube', 'netflix', 'twitch', 'tiktok', 'reddit', 'facebook', 'instagram', 'twitter', 'x.com'], tagName: 'Distraction' },
                { keywords: ['github', 'gitlab', 'jira', 'confluence', 'notion', 'slack', 'teams', 'zoom', 'meet'], tagName: 'Collaborative' },
                { keywords: ['udemy', 'coursera', 'pluralsight', 'skillshare', 'linkedin learning', 'duolingo'], tagName: 'Learning' },
                { keywords: ['figma', 'sketch', 'vscode', 'intellij', 'webstorm', 'terminal', 'postman'], tagName: 'Focus' },
            ];

            for (const app of apps) {
                const nameLower = (app.appName || '').toLowerCase();
                const domainLower = (app.domain || '').toLowerCase();

                for (const rule of AUTO_LABEL_RULES) {
                    if (rule.keywords.some((k) => nameLower.includes(k) || domainLower.includes(k))) {
                        const tag = tags.find(t => t.name === rule.tagName);
                        if (tag) {
                            await productivityService.updateRule({
                                domain: app.domain,
                                appName: app.appName,
                                tagId: tag.id
                            });
                        }
                        break;
                    }
                }
            }
            await get().fetchProductivityData();
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // ── Filter actions ────────────────────────────────────
    updateFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),

    toggleThreshold: () =>
        set((s) => ({ filters: { ...s.filters, thresholdEnabled: !s.filters.thresholdEnabled } })),

    // ── Tag actions ────────────────────────────────────────
    addTag: async (name, color) => {
        const { tags } = get();
        const trimmed = name.trim();
        if (!trimmed) return { error: 'Name is required.' };
        if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return { error: 'Tag already exists.' };
        
        const newColor = color || RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
        try {
            const newTag = await productivityService.createTag({ name: trimmed, color: newColor });
            set((s) => ({ tags: [...s.tags, newTag] }));
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    },

    updateTag: async (id, data) => {
        try {
            const updatedTag = await productivityService.updateTag(id, data);
            set((s) => ({
                tags: s.tags.map((t) => t.id === id ? updatedTag : t),
            }));
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    },

    deleteTag: async (id) => {
        try {
            await productivityService.deleteTag(id);
            set((s) => ({
                tags: s.tags.filter((t) => t.id !== id),
                apps: s.apps.map((a) => a.tagId === id ? { ...a, tagId: null } : a),
            }));
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    },

    getTagUsageCount: (id) => {
        const { apps } = get();
        return apps.filter((a) => a.tagId === id).length;
    },
}));
