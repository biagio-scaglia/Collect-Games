import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { ReviewsPage } from '../components/ReviewsPage';

export const reviewsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/reviews',
    component: () => <ReviewsPage />,
});
