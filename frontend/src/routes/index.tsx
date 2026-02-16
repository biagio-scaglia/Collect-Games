import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Filters } from '../components/Filters';
import { GameCard } from '../components/GameCard';
import { useCollection } from '../hooks/useCollection';
import { useConsoles } from '../hooks/useConsoles';
import { useReviews } from '../hooks/useReviews';
import { useState, useMemo, lazy, Suspense } from 'react';
import { collectionApi } from '../services/api';
import type { UserCollectionItem } from '../types';
import styles from '../App.module.css';
import { PackageOpen } from 'lucide-react';

const EditGameModal = lazy(() => import('../components/EditGameModal').then(m => ({ default: m.EditGameModal })));
const AddReviewModal = lazy(() => import('../components/AddReviewModal').then(m => ({ default: m.AddReviewModal })));

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: CollectionPage,
});

function CollectionPage() {
    const navigate = useNavigate();
    const { data: collection, isLoading, refetch: refetchCollection } = useCollection();
    const { data: consoles } = useConsoles();
    const { refetch: refetchReviews, getReviewByItemId } = useReviews();

    const [searchQuery, setSearchQuery] = useState('');
    const [platformFilter, setPlatformFilter] = useState('');
    const [conditionFilter, setConditionFilter] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<UserCollectionItem | null>(null);
    const [reviewingItem, setReviewingItem] = useState<UserCollectionItem | null>(null);

    const filteredCollection = useMemo(() => {
        return collection.filter((item) => {
            const matchesSearch = item.game?.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPlatform = !platformFilter || item.game?.platform === platformFilter;
            const matchesCondition = !conditionFilter || item.condition.toLowerCase() === conditionFilter.toLowerCase();
            return matchesSearch && matchesPlatform && matchesCondition;
        });
    }, [collection, searchQuery, platformFilter, conditionFilter]);

    const handleEdit = (item: UserCollectionItem) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (item: UserCollectionItem) => {
        if (window.confirm(`Delete "${item.game?.title}"?`)) {
            try {
                await collectionApi.deleteGame(item.id);
                refetchCollection();
                refetchReviews();
            } catch (err) {
                alert('Failed to delete game.');
            }
        }
    };

    const handleAddReview = (item: UserCollectionItem) => {
        setReviewingItem(item);
        setIsReviewModalOpen(true);
    };

    return (
        <>
            <Filters
                consoles={consoles}
                onSearchChange={setSearchQuery}
                onPlatformChange={setPlatformFilter}
                onConditionChange={setConditionFilter}
            />
            <div className={styles.container}>
                {isLoading && <div className={styles.loading}>Loading...</div>}
                {!isLoading && filteredCollection.length === 0 && (
                    <div className={styles.empty}>
                        <PackageOpen size={64} className={styles.emptyIcon} />
                        <p>No games found.</p>
                    </div>
                )}
                <div className={styles.grid}>
                    {filteredCollection.map((item, index) => (
                        <GameCard
                            key={item.id}
                            item={item}
                            index={index}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            review={getReviewByItemId(item.id)}
                            onAddReview={handleAddReview}
                            onEditReview={() => navigate({ to: '/reviews' })}
                        />
                    ))}
                </div>
            </div>

            <Suspense fallback={null}>
                {isEditModalOpen && (
                    <EditGameModal
                        isOpen={isEditModalOpen}
                        onClose={() => { setIsEditModalOpen(false); setEditingItem(null); }}
                        onSuccess={() => { refetchCollection(); }}
                        item={editingItem}
                    />
                )}
                {isReviewModalOpen && (
                    <AddReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => { setIsReviewModalOpen(false); setReviewingItem(null); }}
                        onSuccess={() => { refetchReviews(); }}
                        gameItem={reviewingItem}
                    />
                )}
            </Suspense>
        </>
    );
}
