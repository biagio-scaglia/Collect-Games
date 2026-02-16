import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { WishlistPage } from '../components/WishlistPage';
import { useCollection } from '../hooks/useCollection';

export const wishlistRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wishlist',
    component: () => {
        const { refetch } = useCollection();
        return <WishlistPage onPurchaseSuccess={refetch} />;
    },
});
