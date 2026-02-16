import { useState, useMemo } from 'react';
import { PackageOpen, Heart, MessageSquare, Gamepad2 } from 'lucide-react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { GameCard } from './components/GameCard';
import { AddGameModal } from './components/AddGameModal';
import { EditGameModal } from './components/EditGameModal';
import { WishlistPage } from './components/WishlistPage';
import { ReviewsPage } from './components/ReviewsPage';
import { AddReviewModal } from './components/AddReviewModal';
import { useCollection } from './hooks/useCollection';
import { useConsoles } from './hooks/useConsoles';
import { useReviews } from './hooks/useReviews';
import { collectionApi } from './services/api';
import type { UserCollectionItem } from './types';
import styles from './App.module.css';

type View = 'collection' | 'wishlist' | 'reviews';

function App() {
  const { data: collection, isLoading, error, refetch: refetchCollection } = useCollection();
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

  // Filter collection
  const filteredCollection = useMemo(() => {
    return collection.filter((item) => {
      const matchesSearch = item.game?.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesPlatform = !platformFilter ||
        item.game?.platform === platformFilter;

      const matchesCondition = !conditionFilter ||
        item.condition.toLowerCase() === conditionFilter.toLowerCase();

      return matchesSearch && matchesPlatform && matchesCondition;
    });
  }, [collection, searchQuery, platformFilter, conditionFilter]);

  const handleAddSuccess = () => {
    refetchCollection();
  };

  const handleEdit = (item: UserCollectionItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    refetchCollection();
  };

  const handleDelete = async (item: UserCollectionItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.game?.title}" from your collection?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      try {
        await collectionApi.deleteGame(item.id);
        refetchCollection();
        refetchReviews(); // Reviews are deleted by cascade in backend usually, refreshing list is good
      } catch (err) {
        alert('Failed to delete game. Please try again.');
        console.error('Delete error:', err);
      }
    }
  };

  const handleAddReview = (item: UserCollectionItem) => {
    setReviewingItem(item);
    setIsReviewModalOpen(true);
  };

  const handleReviewSuccess = () => {
    refetchReviews();
  };

  // Render content based on current view
  const renderContent = () => {
    if (currentView === 'wishlist') {
      return <WishlistPage onPurchaseSuccess={refetchCollection} />;
    }

    if (currentView === 'reviews') {
      return <ReviewsPage />;
    }

    // Default: Collection
    return (
      <>
        <Filters
          consoles={consoles}
          onSearchChange={setSearchQuery}
          onPlatformChange={setPlatformFilter}
          onConditionChange={setConditionFilter}
        />

        <div className={styles.container}>
          {isLoading && (
            <div className={styles.loading} role="status" aria-live="polite">
              Loading your collection...
            </div>
          )}

          {error && (
            <div className={styles.error} role="alert">
              Error: {error}
            </div>
          )}

          {!isLoading && !error && filteredCollection.length === 0 && (
            <div className={styles.empty}>
              <PackageOpen size={64} className={styles.emptyIcon} aria-hidden="true" />
              <p>
                {collection.length === 0
                  ? 'No games in your collection yet. Add your first game!'
                  : 'No games match your filters.'}
              </p>
            </div>
          )}

          {!isLoading && !error && filteredCollection.length > 0 && (
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
                  onEditReview={() => {
                    // Could implement edit review modal, for now maybe just navigate to reviews page or alert
                    setCurrentView('reviews');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={styles.app}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header
        totalGames={collection.length}
        onAddClick={() => setIsModalOpen(true)}
      />

      <nav className={styles.navTabs}>
        <button
          className={`${styles.navTab} ${currentView === 'collection' ? styles.activeTab : ''}`}
          onClick={() => setCurrentView('collection')}
        >
          <Gamepad2 size={18} />
          Collection
        </button>
        <button
          className={`${styles.navTab} ${currentView === 'wishlist' ? styles.activeTab : ''}`}
          onClick={() => setCurrentView('wishlist')}
        >
          <Heart size={18} />
          Wishlist
        </button>
        <button
          className={`${styles.navTab} ${currentView === 'reviews' ? styles.activeTab : ''}`}
          onClick={() => setCurrentView('reviews')}
        >
          <MessageSquare size={18} />
          Reviews
        </button>
      </nav>

      <main id="main-content" className={styles.main}>
        {renderContent()}
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Made with <span className={styles.footerHeart}>♥</span> by Biagio for retro gaming collectors
        </p>
      </footer>

      <AddGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
        consoles={consoles}
      />

      <EditGameModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSuccess={handleEditSuccess}
        item={editingItem}
      />

      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewingItem(null);
        }}
        onSuccess={handleReviewSuccess}
        gameItem={reviewingItem}
      />
    </div>
  );
}

export default App;
