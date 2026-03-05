import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const RANDOM_COLORS = ['#F5A623', '#FF6B6B', '#FF4D4F', '#FFD666', '#9254DE', '#69C0FF', '#D3ADF7', '#52C41A', '#13C2C2', '#2F54EB'];

const INITIAL_TAGS = [
    { id: 1, name: 'Billable', color: '#F5A623' },
    { id: 2, name: 'Collaborative', color: '#FF6B6B' },
    { id: 3, name: 'Distraction', color: '#FF4D4F' },
    { id: 4, name: 'Focus', color: '#FFD666' },
    { id: 5, name: 'Learning', color: '#9254DE' },
    { id: 6, name: 'Nonbillable', color: '#69C0FF' },
    { id: 7, name: 'Personal', color: '#D3ADF7' },
];

// Auto-labeling keyword map
const AUTO_LABEL_RULES = [
    { keywords: ['youtube', 'netflix', 'twitch', 'tiktok', 'reddit', 'facebook', 'instagram', 'twitter', 'x.com'], tagId: 3 }, // Distraction
    { keywords: ['github', 'gitlab', 'jira', 'confluence', 'notion', 'slack', 'teams', 'zoom', 'meet'], tagId: 2 }, // Collaborative
    { keywords: ['udemy', 'coursera', 'pluralsight', 'skillshare', 'linkedin learning', 'duolingo'], tagId: 5 }, // Learning
    { keywords: ['gmail', 'outlook', 'calendar', 'docs', 'sheets', 'word', 'excel', 'powerpoint'], tagId: 2 }, // Collaborative
    { keywords: ['figma', 'sketch', 'vscode', 'intellij', 'webstorm', 'terminal', 'postman'], tagId: 4 }, // Focus
];

const INITIAL_APPS = [
    { id: 'a1', name: 'GitHub', domain: 'github.com', totalUsage: 42.5, category: 'Development', tagId: 2, selected: false },
    { id: 'a2', name: 'Slack', domain: 'slack.com', totalUsage: 18.3, category: 'Communication', tagId: 2, selected: false },
    { id: 'a3', name: 'YouTube', domain: 'youtube.com', totalUsage: 14.1, category: 'Entertainment', tagId: 3, selected: false },
    { id: 'a4', name: 'VS Code', domain: 'code.visualstudio.com', totalUsage: 67.2, category: 'Development', tagId: 4, selected: false },
    { id: 'a5', name: 'Figma', domain: 'figma.com', totalUsage: 31.8, category: 'Design', tagId: 4, selected: false },
    { id: 'a6', name: 'Gmail', domain: 'gmail.com', totalUsage: 22.4, category: 'Communication', tagId: 2, selected: false },
    { id: 'a7', name: 'Notion', domain: 'notion.so', totalUsage: 12.6, category: 'Productivity', tagId: 2, selected: false },
    { id: 'a8', name: 'Reddit', domain: 'reddit.com', totalUsage: 8.9, category: 'Social', tagId: 3, selected: false },
    { id: 'a9', name: 'Zoom', domain: 'zoom.us', totalUsage: 19.7, category: 'Communication', tagId: 2, selected: false },
    { id: 'a10', name: 'Jira', domain: 'atlassian.com', totalUsage: 28.3, category: 'Project Mgmt', tagId: 2, selected: false },
    { id: 'a11', name: 'Udemy', domain: 'udemy.com', totalUsage: 5.4, category: 'Learning', tagId: 5, selected: false },
    { id: 'a12', name: 'Twitter / X', domain: 'x.com', totalUsage: 6.2, category: 'Social', tagId: 3, selected: false },
    { id: 'a13', name: 'Google Docs', domain: 'docs.google.com', totalUsage: 25.1, category: 'Productivity', tagId: 2, selected: false },
    { id: 'a14', name: 'Spotify', domain: 'spotify.com', totalUsage: 38.7, category: 'Entertainment', tagId: null, selected: false },
    { id: 'a15', name: 'Postman', domain: 'postman.com', totalUsage: 11.3, category: 'Development', tagId: 4, selected: false },
];

export const useProductivityStore = create(
    persist(
        (set, get) => ({
            apps: INITIAL_APPS,
            filters: {
                organization: 'Organization',
                view: 'All apps & websites',
                thresholdEnabled: false,
                thresholdHours: 4,
                search: '',
                activeTag: null,
            },
            tags: INITIAL_TAGS,
            nextTagId: 8,

            // ── App actions ────────────────────────────────────────
            toggleSelectApp: (id) =>
                set((s) => ({
                    apps: s.apps.map((a) => a.id === id ? { ...a, selected: !a.selected } : a),
                })),

            toggleSelectAll: (checked) =>
                set((s) => ({ apps: s.apps.map((a) => ({ ...a, selected: checked })) })),

            setAppTag: (appId, tagId) =>
                set((s) => ({
                    apps: s.apps.map((a) => a.id === appId ? { ...a, tagId } : a),
                })),

            autoLabel: () =>
                set((s) => ({
                    apps: s.apps.map((app) => {
                        const nameLower = app.name.toLowerCase();
                        const domainLower = app.domain.toLowerCase();
                        for (const rule of AUTO_LABEL_RULES) {
                            if (rule.keywords.some((k) => nameLower.includes(k) || domainLower.includes(k))) {
                                return { ...app, tagId: rule.tagId };
                            }
                        }
                        return app;
                    }),
                })),

            // ── Filter actions ────────────────────────────────────
            updateFilter: (key, value) =>
                set((s) => ({ filters: { ...s.filters, [key]: value } })),

            toggleThreshold: () =>
                set((s) => ({ filters: { ...s.filters, thresholdEnabled: !s.filters.thresholdEnabled } })),

            // ── Tag actions ────────────────────────────────────────
            addTag: (name, color) => {
                const { tags, nextTagId } = get();
                const trimmed = name.trim();
                if (!trimmed) return { error: 'Name is required.' };
                if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return { error: 'Tag already exists.' };
                const newColor = color || RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
                set((s) => ({
                    tags: [...s.tags, { id: nextTagId, name: trimmed, color: newColor }],
                    nextTagId: s.nextTagId + 1,
                }));
                return { success: true };
            },

            updateTagColor: (id, color) =>
                set((s) => ({
                    tags: s.tags.map((t) => t.id === id ? { ...t, color } : t),
                })),

            updateTagName: (id, name) =>
                set((s) => ({
                    tags: s.tags.map((t) => t.id === id ? { ...t, name } : t),
                })),

            deleteTag: (id) =>
                set((s) => ({
                    tags: s.tags.filter((t) => t.id !== id),
                    apps: s.apps.map((a) => a.tagId === id ? { ...a, tagId: null } : a),
                })),

            mergeTag: (sourceId, targetId) =>
                set((s) => ({
                    apps: s.apps.map((a) => a.tagId === sourceId ? { ...a, tagId: targetId } : a),
                    tags: s.tags.filter((t) => t.id !== sourceId),
                })),

            getTagUsageCount: (id) => {
                const { apps } = get();
                return apps.filter((a) => a.tagId === id).length;
            },
        }),
        { name: 'productivity-storage' }
    )
);
