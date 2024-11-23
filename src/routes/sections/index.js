import { Navigate, useRoutes } from 'react-router-dom';
import MainLayout from 'src/layouts/main';
import MaintenancePage from 'src/pages/maintenance'; // Ensure this is correctly imported
import { mainRoutes, HomePage } from './main';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

export default function Router() {
  const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE === 'true';

  // Define routes based on maintenance mode
  const routes = isMaintenanceMode
    ? [
      { path: '/maintenance', element: <MaintenancePage /> },
      { path: '*', element: <Navigate to="/maintenance" replace /> },
    ]
    : [
      {
        path: '/',
        element: (
          <MainLayout>
            <HomePage />
          </MainLayout>
        ),
      },
      // Auth routes
      ...authRoutes,
      ...authDemoRoutes,
      // Dashboard routes
      ...dashboardRoutes,
      // Main routes
      ...mainRoutes,
      // Components routes
      ...componentsRoutes,
      // No match 404
      { path: '*', element: <Navigate to="/404" replace /> },
    ];

  // Call useRoutes unconditionally with the dynamically chosen routes
  return useRoutes(routes);
}
