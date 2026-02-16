import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { wishlistRoute } from './routes/wishlist';
import { reviewsRoute } from './routes/reviews';
import { statsRoute } from './routes/stats';

const routeTree = rootRoute.addChildren([
    indexRoute,
    wishlistRoute,
    reviewsRoute,
    statsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
