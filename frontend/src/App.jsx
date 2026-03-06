import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { TimeAndAttendance } from './pages/TimeAndAttendance';
import { ActivityMonitoring } from './pages/ActivityMonitoring';
import { ScreenshotMonitoring } from './pages/ScreenshotMonitoring';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { EmployeeProfile } from './pages/EmployeeProfile';
import { Settings } from './pages/Settings';
// Attendance is now part of TimeAndAttendance
import { LocationTracking } from './pages/LocationTracking';
import { TasksProjects } from './pages/TasksProjects';
import { Reports } from './pages/Reports';
import { WorkType } from './pages/reports/WorkType';
import { ScheduleAdherence } from './pages/reports/ScheduleAdherence';
import { WorkloadDistribution } from './pages/reports/WorkloadDistribution';
import { AppsWebsites } from './pages/reports/AppsWebsites';
import { LocationInsights } from './pages/reports/LocationInsights';
import { Payroll } from './pages/Payroll';
import { Alerts } from './pages/Alerts';
import { Compliance } from './pages/Compliance';
import { Notifications } from './pages/Notifications';
import { RealTimeInsights } from './pages/RealTimeInsights';
import { Teams } from './pages/Teams';
import { Projects } from './pages/Projects';
import { Login } from './pages/Login';
import { WorkloadDistributionSettings } from './pages/settings/reports/WorkloadDistributionSettings';
import { LocationInsightsSettings } from './pages/settings/reports/LocationInsightsSettings';
import { AlertsLayout } from './pages/settings/alerts/AlertsLayout';
import { AttendanceAlerts } from './pages/settings/alerts/AttendanceAlerts';
import { SecurityAlerts } from './pages/settings/alerts/SecurityAlerts';
import { ShiftScheduling } from './pages/settings/alerts/ShiftScheduling';
import { OtherAlerts } from './pages/settings/alerts/OtherAlerts';
import { ApiTokens } from './pages/settings/ApiTokens';
import { AuditLogs } from './pages/settings/AuditLogs';
import { EmailReports } from './pages/settings/EmailReports';
import { BillingLayout } from './pages/settings/billing/BillingLayout';
import { ManualTime } from './pages/settings/ManualTime';
import { Organization } from './pages/settings/Organization';
import { PersonalSettings } from './pages/settings/PersonalSettings';
import { Privacy } from './pages/settings/Privacy';
import { PrivacyOverview } from './components/privacy/PrivacyOverview';
import { PrivacyCompliance } from './components/privacy/PrivacyCompliance';
import { ProductivityApps } from './pages/settings/ProductivityApps';
import { SecurityLanding } from './pages/settings/SecurityLanding';
import { SamlWizard } from './pages/settings/SamlWizard';
import { TrackingSettings } from './pages/settings/TrackingSettings';
import { AdvancedTrackingSettings } from './pages/settings/AdvancedTrackingSettings';
import { ManageUsers } from './pages/settings/ManageUsers';
import { ManageOrgGroups } from './pages/settings/ManageOrgGroups';
import { Utilization } from './pages/settings/Utilization';
import { Plans } from './pages/settings/billing/Plans';
import { AddOns } from './pages/settings/billing/AddOns';
import { IntegrationsLayout } from './pages/settings/integrations/IntegrationsLayout';
import { OrgChart } from './pages/settings/integrations/OrgChart';
import { DataWarehouse } from './pages/settings/integrations/DataWarehouse';
import { ProjectManagement } from './pages/settings/integrations/ProjectManagement';
import { Calendar } from './pages/settings/integrations/Calendar';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { RealTimeProvider } from './hooks/RealTimeContext';

import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

import authService from './services/authService';

function App() {
    const { isAuthenticated, role, setSession } = useAuthStore();

    useEffect(() => {
        // Cleanup malformed URLs
        if (window.location.pathname.includes('/undefined')) {
            console.warn('URL contains "undefined", cleaning up...');
            window.location.href = '/';
            return;
        }

        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');

            // If we have no token, make sure we are logged out in store
            if (!savedToken) {
                if (isAuthenticated) useAuthStore.getState().logout();
                return;
            }

            // If we have a token but missing profile data, fetch it
            if (savedToken && (!isAuthenticated || !role)) {
                console.log('Initializing auth session...');
                try {
                    const response = await authService.getCurrentUser();
                    if (response.success) {
                        console.log('Auth session restored:', response.data.role);
                        setSession(response.data);
                    } else {
                        throw new Error(response.message || 'Session fetch failed');
                    }
                } catch (error) {
                    console.error('Auth refresh failed:', error.message);
                    localStorage.removeItem('token');
                    useAuthStore.getState().logout();
                }
            }
        };

        initAuth();
    }, [isAuthenticated, role, setSession]);

    return (
        <RealTimeProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />

                    {/* Protected Dashboard Routes */}
                    <Route path="/" element={<ProtectedRoute><Navigate to="/" replace /></ProtectedRoute>} />
                    <Route path="/:rolePath/*" element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="real-time" element={<RealTimeInsights />} />
                                    <Route path="time-attendance" element={<TimeAndAttendance />} />
                                    <Route path="activity" element={<ActivityMonitoring />} />
                                    <Route path="screenshots" element={<ScreenshotMonitoring />} />
                                    <Route path="location" element={<LocationTracking />} />
                                    <Route path="tasks" element={<TasksProjects />} />

                                    <Route path="reports" element={<Reports />}>
                                        <Route index element={<Navigate to="work-type" replace />} />
                                        <Route path="work-type" element={<WorkType />} />
                                        <Route path="schedule-adherence" element={<ScheduleAdherence />} />
                                        <Route path="workload-distribution" element={<WorkloadDistribution />} />
                                        <Route path="apps-websites" element={<AppsWebsites />} />
                                        <Route path="location-insights" element={<LocationInsights />} />
                                    </Route>
                                    <Route path="payroll" element={<Payroll />} />
                                    <Route path="alerts" element={<Alerts />} />
                                    <Route path="employees" element={<EmployeeManagement />} />
                                    <Route path="employees/:id" element={<EmployeeProfile />} />
                                    <Route path="teams" element={<Teams />} />
                                    <Route path="projects" element={<Projects />} />
                                    <Route path="settings" element={<Settings />} />
                                    <Route path="settings/reports/workload-distribution" element={<WorkloadDistributionSettings />} />
                                    <Route path="settings/reports/location-insights" element={<LocationInsightsSettings />} />

                                    <Route path="settings/alerts" element={<AlertsLayout />}>
                                        <Route index element={<Navigate to="attendance" replace />} />
                                        <Route path="attendance" element={<AttendanceAlerts />} />
                                        <Route path="security" element={<SecurityAlerts />} />
                                        <Route path="shift-scheduling" element={<ShiftScheduling />} />
                                        <Route path="other" element={<OtherAlerts />} />
                                    </Route>
                                    <Route path="settings/productivity/apps" element={<ProductivityApps />} />

                                    <Route path="settings/api-tokens" element={<ApiTokens />} />
                                    <Route path="settings/audit-logs" element={<AuditLogs />} />
                                    <Route path="settings/email-reports" element={<EmailReports />} />
                                    <Route path="settings/manual-time" element={<ManualTime />} />
                                    <Route path="settings/organization" element={<Organization />} />
                                    <Route path="settings/personal" element={<PersonalSettings />} />
                                    <Route path="settings/security" element={<SecurityLanding />} />
                                    <Route path="settings/security/saml" element={<SamlWizard />} />
                                    <Route path="settings/tracking" element={<TrackingSettings />} />
                                    <Route path="settings/tracking/advanced" element={<><TrackingSettings /><AdvancedTrackingSettings /></>} />
                                    <Route path="settings/user-management/users" element={<ManageUsers />} />
                                    <Route path="settings/user-management/org-groups" element={<ManageOrgGroups />} />
                                    <Route path="settings/utilization" element={<Utilization />} />
                                    <Route path="settings/privacy" element={<Privacy />}>
                                        <Route index element={<Navigate to="overview" replace />} />
                                        <Route path="overview" element={<PrivacyOverview />} />
                                        <Route path="compliance" element={<PrivacyCompliance />} />
                                    </Route>
                                    <Route path="settings/integrations" element={<IntegrationsLayout />}>
                                        <Route index element={<Navigate to="overview/org-chart" replace />} />
                                        <Route path="overview/org-chart" element={<OrgChart />} />
                                        <Route path="overview/data-warehouse" element={<DataWarehouse />} />
                                        <Route path="overview/project-management" element={<ProjectManagement />} />
                                        <Route path="overview/calendar" element={<Calendar />} />
                                    </Route>

                                    <Route path="settings/billing" element={<BillingLayout />}>
                                        <Route index element={<Navigate to="plans" replace />} />
                                        <Route path="plans" element={<Plans />} />
                                        <Route path="add-ons" element={<AddOns />} />
                                    </Route>

                                    <Route path="compliance" element={<Compliance />} />
                                    <Route path="notifications" element={<Notifications />} />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </DashboardLayout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </RealTimeProvider>
    );
}

export default App;
