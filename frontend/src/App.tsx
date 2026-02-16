import { useState, useMemo, Suspense, lazy } from 'react';
import { PackageOpen, Heart, MessageSquare, Gamepad2 } from 'lucide-react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { GameCard } from './components/GameCard';
import { WishlistPage } from './components/WishlistPage';
import { ReviewsPage } from './components/ReviewsPage';
import { useCollection } from './hooks/useCollection';
import { useConsoles } from './hooks/useConsoles';
import { useReviews } from './hooks/useReviews';
import { collectionApi } from './services/api';
import type { UserCollectionItem } from './types';
import styles from './App.module.css';

// Lazy load modals for performance
const AddGameModal = lazy(() => import('./components/AddGameModal').then(m => ({ default: m.AddGameModal })));
const EditGameModal = lazy(() => import('./components/EditGameModal').then(m => ({ default: m.EditGameModal })));
const AddReviewModal = lazy(() => import('./components/AddReviewModal').then(m => ({ default: m.AddReviewModal })));

type View = 'collection' | 'wishlist' | 'reviews';

function App() {
  const { data: collection, isLoading, refetch: refetchCollection } = useCollection();
  const { data: consoles } = useConsoles();
  const { refetch: refetchReviews, getReviewByItemId } = useReviews();

  const [currentView, setCurrentView] = useState<View>('collection');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<UserCollectionItem | null>(null);
  const [reviewingItem, setReviewingItem] = useState<UserCollectionItem | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');

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

  const renderContent = () => {
    if (currentView === 'wishlist') return <WishlistPage onPurchaseSuccess={refetchCollection} />;
    if (currentView === 'reviews') return <ReviewsPage />;

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
                onEditReview={() => setCurrentView('reviews')}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  const handleExportPdf = () => {
    window.open('http://localhost:5000/api/UserCollection/export/pdf', '_blank');
  };

  return (
    <div className={styles.app}>
      <Header
        totalGames={collection.length}
        onAddClick={() => setIsModalOpen(true)}
        onExportPdf={handleExportPdf}
      />

      <nav className={styles.navTabs}>
        <button className={`${styles.navTab} ${currentView === 'collection' ? styles.activeTab : ''}`} onClick={() => setCurrentView('collection')}>
          <Gamepad2 size={18} /> Collection
        </button>
        <button className={`${styles.navTab} ${currentView === 'wishlist' ? styles.activeTab : ''}`} onClick={() => setCurrentView('wishlist')}>
          <Heart size={18} /> Wishlist
        </button>
        <button className={`${styles.navTab} ${currentView === 'reviews' ? styles.activeTab : ''}`} onClick={() => setCurrentView('reviews')}>
          <MessageSquare size={18} /> Reviews
        </button>
      </nav>

      <main id="main-content" className={styles.main}>
        {renderContent()}
      </main>

      <Suspense fallback={null}>
        <AddGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refetchCollection} consoles={consoles} />
        {isEditModalOpen && <EditGameModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingItem(null); }} onSuccess={refetchCollection} item={editingItem} />}
        {isReviewModalOpen && <AddReviewModal isOpen={isReviewModalOpen} onClose={() => { setIsReviewModalOpen(false); setReviewingItem(null); }} onSuccess={refetchReviews} gameItem={reviewingItem} />}
      </Suspense>

      <footer className={styles.footer}>
        <p className={styles.footerText}>Made with ♥ by Biagio</p>
      </footer>
    </div>
  );
}

export default App;
