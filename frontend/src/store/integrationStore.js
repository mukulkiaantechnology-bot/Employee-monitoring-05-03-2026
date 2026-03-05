import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Integration metadata (logos + descriptions + config type) ──────────────
export const INTEGRATION_META = {
    // Org Chart
    csvImport: {
        name: 'CSV Import',
        description: 'Upload your organizational data using CSV files or import it via an API.',
        logo: '📄',
        logoColor: '#6366f1',
        configType: 'hr',
        requestAccess: false,
    },
    alexisHR: {
        name: 'AlexisHR',
        description: 'Sync employee information from AlexisHR with existing Insightful employees.',
        logo: 'A',
        logoColor: '#0ea5e9',
        configType: 'hr',
        requestAccess: false,
    },
    bambooHR: {
        name: 'BambooHR',
        description: 'Sync employee information from BambooHR with existing Insightful employees.',
        logo: '🎋',
        logoColor: '#22c55e',
        configType: 'hr',
        requestAccess: false,
    },
    chartHop: {
        name: 'ChartHop',
        description: 'Sync employee information from ChartHop with existing Insightful employees.',
        logo: '≈',
        logoColor: '#a855f7',
        configType: 'hr',
        requestAccess: false,
    },
    googleWorkspace: {
        name: 'Google Workspace',
        description: 'Sync employee information from Google Workspace with existing Insightful employees.',
        logo: 'G',
        logoColor: '#ea4335',
        configType: 'oauth',
        requestAccess: false,
    },
    hibob: {
        name: 'Hibob',
        description: 'Sync employee information from Hibob with existing Insightful employees.',
        logo: 'b',
        logoColor: '#f43f5e',
        configType: 'hr',
        requestAccess: false,
    },
    // Data Warehouse
    bigQuery: {
        name: 'BigQuery',
        description: 'Upload your data to BigQuery',
        logo: '⬡',
        logoColor: '#4f46e5',
        configType: 'warehouse',
        requestAccess: true,
        beta: false,
    },
    snowflake: {
        name: 'Snowflake',
        description: 'Upload your data to Snowflake',
        logo: '❄',
        logoColor: '#38bdf8',
        configType: 'warehouse',
        requestAccess: true,
        beta: true,
    },
    // Project Management
    asana: {
        name: 'Asana',
        description: 'Import the Asana items you want to track time on',
        logo: '⬤',
        logoColor: '#f06a6a',
        configType: 'project',
        requestAccess: false,
    },
    azureDevops: {
        name: 'Azure DevOps',
        description: 'Import the Azure DevOps items you want to track time on',
        logo: '❑',
        logoColor: '#0078d4',
        configType: 'project',
        requestAccess: false,
    },
    clickup: {
        name: 'ClickUp',
        description: 'Import the ClickUp items you want to track time on',
        logo: 'C',
        logoColor: '#7b68ee',
        configType: 'project',
        requestAccess: false,
    },
    height: {
        name: 'Height',
        description: 'Import the Height items you want to track time on',
        logo: 'H',
        logoColor: '#ec4899',
        configType: 'project',
        requestAccess: false,
    },
    jira: {
        name: 'Jira',
        description: 'Import the JIRA items you want to track time on',
        logo: '◆',
        logoColor: '#0052cc',
        configType: 'project',
        requestAccess: false,
    },
    teamwork: {
        name: 'Teamwork',
        description: 'Import the Teamwork items you want to track time on',
        logo: 't',
        logoColor: '#6366f1',
        configType: 'project',
        requestAccess: false,
    },
    // Calendar
    googleCalendar: {
        name: 'Google Calendar',
        description: "Import your employee's meetings into Insightful.",
        logo: '31',
        logoColor: '#4285f4',
        configType: 'calendar',
        requestAccess: false,
    },
    outlookCalendar: {
        name: 'Microsoft Outlook Calendar',
        description: "Import your employee's meetings into Insightful.",
        logo: 'O',
        logoColor: '#0078d4',
        configType: 'calendar',
        requestAccess: false,
    },
};

// ── Tab definitions ────────────────────────────────────────────────────────
export const INTEGRATION_TABS = [
    {
        id: 'org-chart',
        label: 'Org Chart',
        route: '/settings/integrations/overview/org-chart',
        subtitle: 'Synchronize your organizational hierarchy by integrating your app with Insightful.',
        keys: ['csvImport', 'alexisHR', 'bambooHR', 'chartHop', 'googleWorkspace', 'hibob'],
    },
    {
        id: 'data-warehouse',
        label: 'Data Warehouse',
        route: '/settings/integrations/overview/data-warehouse',
        subtitle: "Import Insightful's data into your data warehouse solution",
        keys: ['bigQuery', 'snowflake'],
        featureGate: 'dataWarehouse',
    },
    {
        id: 'project-management',
        label: 'Project Management',
        route: '/settings/integrations/overview/project-management',
        subtitle: 'Integrate your project management applications with Insightful',
        keys: ['asana', 'azureDevops', 'clickup', 'height', 'jira', 'teamwork'],
    },
    {
        id: 'calendar',
        label: 'Calendar',
        route: '/settings/integrations/overview/calendar',
        subtitle: "Use calendar integration as an additional data source for better visibility into employee's work activities.",
        keys: ['googleCalendar', 'outlookCalendar'],
    },
];

// ── Default state ──────────────────────────────────────────────────────────
const buildDefault = (keys) =>
    Object.fromEntries(keys.map((k) => [k, { connected: false, config: {} }]));

const DEFAULT_INTEGRATIONS = {
    ...buildDefault(['csvImport', 'alexisHR', 'bambooHR', 'chartHop', 'googleWorkspace', 'hibob']),
    ...buildDefault(['bigQuery', 'snowflake']),
    ...buildDefault(['asana', 'azureDevops', 'clickup', 'height', 'jira', 'teamwork']),
    ...buildDefault(['googleCalendar', 'outlookCalendar']),
};

// ── Store ─────────────────────────────────────────────────────────────────
export const useIntegrationStore = create(
    persist(
        (set) => ({
            integrations: DEFAULT_INTEGRATIONS,

            connectIntegration: (id, config = {}) =>
                set((state) => ({
                    integrations: {
                        ...state.integrations,
                        [id]: { connected: true, config },
                    },
                })),

            disconnectIntegration: (id) =>
                set((state) => ({
                    integrations: {
                        ...state.integrations,
                        [id]: { connected: false, config: {} },
                    },
                })),

            updateIntegrationConfig: (id, config) =>
                set((state) => ({
                    integrations: {
                        ...state.integrations,
                        [id]: { ...state.integrations[id], config },
                    },
                })),
        }),
        { name: 'integrations-storage' }
    )
);
