import { Trash2, ShoppingCart, Pencil, ExternalLink, ArrowRight } from 'lucide-react';
import type { WishlistItem } from '../types';
import styles from './WishlistCard.module.css';

interface WishlistCardProps {
    item: WishlistItem;
    onEdit: (item: WishlistItem) => void;
    onDelete: (item: WishlistItem) => void;
    onPurchase: (item: WishlistItem) => void;
}

export function WishlistCard({ item, onEdit, onDelete, onPurchase }: WishlistCardProps) {
    const priorityColor = {
        High: 'var(--snes-red)',
        Medium: 'var(--snes-yellow)',
        Low: 'var(--snes-blue)'
    }[item.priority];

    return (
        <div className={styles.card} style={{ '--priority-color': priorityColor } as React.CSSProperties}>
            <div className={styles.imageContainer}>
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl.startsWith('/') ? `http://localhost:5000${item.imageUrl}` : item.imageUrl}
                        alt={item.title}
                        className={styles.image}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <ShoppingCart size={48} className={styles.placeholderIcon} />
                    </div>
                )}
                <div className={styles.priorityBadge} style={{ backgroundColor: priorityColor }}>
                    {item.priority}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title} title={item.title}>{item.title}</h3>

                <div className={styles.platformBadge}>{item.platform}</div>

                <div className={styles.details}>
                    {item.estimatedPrice && (
                        <div className={styles.price}>
                            Est: €{item.estimatedPrice.toFixed(2)}
                        </div>
                    )}
                    {item.addedDate && (
                        <div className={styles.date}>
                            Added: {new Date(item.addedDate).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {item.purchaseLink && (
                    <a
                        href={item.purchaseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        <ExternalLink size={14} />
                        View Offer
                    </a>
                )}

                {item.notes && <p className={styles.notes}>{item.notes}</p>}

                <div className={styles.actions}>
                    <button
                        className={styles.actionButton}
                        onClick={() => onEdit(item)}
                        title="Edit"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => onDelete(item)}
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button
                        className={styles.purchaseButton}
                        onClick={() => onPurchase(item)}
                        title="Mark as Purchased"
                    >
                        <ArrowRight size={18} />
                        Purchased
                    </button>
                </div>
            </div>
        </div>
    );
}
