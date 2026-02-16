import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, FileDown } from 'lucide-react';
import { wishlistApi } from '../services/api';
import type { WishlistItem } from '../types';
import { WishlistCard } from './WishlistCard';
import { AddWishlistModal } from './AddWishlistModal';
import styles from '../App.module.css'; // Reuse main app styles
// We might need specific styles, but let's try to reuse or inline for now, or create a module.
// Let's reuse App.module.css structure if possible, but we don't have access to it easily without viewing it.
// Assuming we pass className or use global styles? No, it's CSS modules.
// Let's create a local style or just simple inline for the grid.
// Better to use a new module: WishlistPage.module.css

interface WishlistPageProps {
    onPurchaseSuccess: () => void; // Callback to refresh collection count or something
}

export function WishlistPage({ onPurchaseSuccess }: WishlistPageProps) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);

    const fetchWishlist = async () => {
        setIsLoading(true);
        try {
            const data = await wishlistApi.fetchWishlist();
            setWishlist(data);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleDelete = async (item: WishlistItem) => {
        if (window.confirm(`Remove "${item.title}" from wishlist?`)) {
            await wishlistApi.deleteWishlistItem(item.id);
            fetchWishlist();
        }
    };

    const handlePurchase = async (item: WishlistItem) => {
        const price = prompt(`Enter price paid for "${item.title}" (leave empty for estimated price):`, item.estimatedPrice?.toString() || '');
        if (price === null) return; // Cancelled

        const pricePaid = price ? parseFloat(price) : undefined;

        try {
            await wishlistApi.markAsPurchased(item.id, {
                title: item.title,
                platform: item.platform,
                condition: 'Loose', // Default
                pricePaid: pricePaid,
                purchaseDate: new Date().toISOString().split('T')[0],
                notes: item.notes
            });
            alert(`"${item.title}" moved to collection!`);
            fetchWishlist();
            onPurchaseSuccess();
        } catch (error) {
            console.error('Failed to mark as purchased:', error);
            alert('Failed to move to collection.');
        }
    };

    const handleEdit = (item: WishlistItem) => {
        setEditingItem(item);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingItem(null);
    };


    const handleExportPdf = () => {
        window.open('http://localhost:5000/api/Wishlist/export/pdf', '_blank');
    };

    return (
        <div className="wishlist-page">
            <div className={styles.pageHeader}>
                <button
                    className={styles.primaryButton}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus size={20} />
                    Add to Wishlist
                </button>
                <button
                    className={styles.secondaryButton}
                    onClick={handleExportPdf}
                    disabled={wishlist.length === 0}
                >
                    <FileDown size={20} />
                    Export PDF
                </button>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Loading wishlist...</div>
            ) : wishlist.length === 0 ? (
                <div className={styles.empty}>
                    <ShoppingCart size={48} className={styles.emptyIcon} />
                    <p>Your wishlist is empty</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {wishlist.map(item => (
                        <WishlistCard
                            key={item.id}
                            item={item}
                            onDelete={handleDelete}
                            onPurchase={handlePurchase}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            <AddWishlistModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchWishlist}
                editingItem={editingItem}
            />
        </div>
    );
}
