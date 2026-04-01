import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute({ children }) {
    const location = useLocation();
    const { isAuthenticated, role, agentStatus, isClockedIn } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // // Role-based Agent Check (Disabled as per user request to rely on WebTrackerAgent)
    // const isEmployee = role?.toUpperCase() === 'EMPLOYEE';
    // const isAgentRequiredPage = location.pathname === '/agent-required';

    // if (isAuthenticated && isEmployee && !agentStatus?.active && !isAgentRequiredPage) {
    //     return <Navigate to="/agent-required" replace />;
    // }

    // Mandatory Work Session Check for Employees
    // We let WebTrackerAgent handle the blocking overlay globally, 
    // but we can still prevent access to specific logic if needed.

    // // If they are on the agent required page and are supposed to be there, let them render it
    // if (isAuthenticated && isEmployee && !agentStatus?.active && isAgentRequiredPage) {
    //     return children;
    // }

    const parts = location.pathname.split('/').filter(Boolean);
    const urlRole = parts[0];
    const expectedRole = role?.toLowerCase();

    // If role is not yet loaded, show loading but add a way to escape
    if (isAuthenticated && !role) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-slate-600 font-medium">Loading Profile...</p>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                    className="mt-6 text-sm text-primary-600 hover:underline"
                >
                    Stuck? Back to Login
                </button>
            </div>
        );
    }

    // If urlRole is "undefined" or malformed, redirect to clean role dashboard
    if (urlRole === 'undefined' || (expectedRole && !['admin', 'manager', 'employee'].includes(urlRole))) {
        return <Navigate to={`/${expectedRole}`} replace />;
    }

    // If urlRole is a known role but it's not THEIR role
    if (urlRole && urlRole !== expectedRole && ['admin', 'manager', 'employee'].includes(urlRole)) {
        return <Navigate to={`/${expectedRole}`} replace />;
    }

    // If there is no role in URL, prepend their role
    if (expectedRole && !urlRole) {
        return <Navigate to={`/${expectedRole}`} replace />;
    }

    return children;
}

export function RoleRoute({ children, allowedRoles }) {
    const { role, isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to their respective dashboard if they don't have access
        const dashboardMap = {
            Admin: '/',
            Manager: '/real-time', // or a specific manager dashboard if exists
            Employee: '/tasks'
        };
        return <Navigate to={dashboardMap[role] || '/'} replace />;
    }

    return children;
}

export function PublicRoute({ children }) {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}
