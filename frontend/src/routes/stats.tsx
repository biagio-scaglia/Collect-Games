import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { StatsDashboard } from '../components/StatsDashboard';

export const statsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/stats',
    component: StatsDashboard,
});
