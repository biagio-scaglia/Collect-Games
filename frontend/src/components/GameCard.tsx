import { Calendar, DollarSign, Package, Image as ImageIcon, Pencil, Trash2, MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserCollectionItem, Review } from '../types';
import { getConsoleImage } from '../utils/consoleImages';
import { StarRating } from './StarRating';
import styles from './GameCard.module.css';

interface GameCardProps {
    item: UserCollectionItem;
    index: number;
    onEdit?: (item: UserCollectionItem) => void;
    onDelete?: (item: UserCollectionItem) => void;
    review?: Review;
    onAddReview?: (item: UserCollectionItem) => void;
    onEditReview?: (review: Review) => void;
}

export function GameCard({ item, index, onEdit, onDelete, review, onAddReview, onEditReview }: GameCardProps) {
    const { game, condition, pricePaid, purchaseDate, userImagePath, notes } = item;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return 'N/A';
        return `€${price.toFixed(2)}`;
    };

    const getConditionClass = () => {
        const conditionLower = condition.toLowerCase();
        if (conditionLower === 'cib') return styles.cib;
        if (conditionLower === 'sealed') return styles.sealed;
        return styles.loose;
    };

    return (
        <motion.article
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: 'easeOut'
            }}
            whileHover={{ scale: 1.02 }}
            tabIndex={0}
            role="article"
            aria-label={`${game?.title} for ${game?.platform}`}
        >
            <div className={styles.imageContainer}>
                {userImagePath ? (
                    <img
                        src={`http://localhost:5000${userImagePath}`}
                        alt={`Cover art for ${game?.title}`}
                        className={styles.image}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.placeholder} aria-hidden="true">
                        <ImageIcon size={64} className={styles.placeholderIcon} />
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{game?.title || 'Unknown Title'}</h3>

                <div className={styles.platform}>
                    {getConsoleImage(game?.platform || '') ? (
                        <img
                            src={getConsoleImage(game?.platform || '') || ''}
                            alt=""
                            className={styles.consoleIcon}
                            aria-hidden="true"
                        />
                    ) : (
                        <Package size={14} aria-hidden="true" />
                    )}
                    <span>{game?.platform || 'Unknown'}</span>
                </div>

                <div className={styles.details}>
                    <div className={styles.detail}>
                        <Package size={16} className={styles.detailIcon} aria-hidden="true" />
                        <span className={styles.detailLabel}>Condition:</span>
                        <span className={`${styles.condition} ${getConditionClass()}`}>
                            {condition}
                        </span>
                    </div>

                    <div className={styles.detail}>
                        <DollarSign size={16} className={styles.detailIcon} aria-hidden="true" />
                        <span className={styles.detailLabel}>Price:</span>
                        <span className={styles.detailValue}>{formatPrice(pricePaid)}</span>
                    </div>

                    <div className={styles.detail}>
                        <Calendar size={16} className={styles.detailIcon} aria-hidden="true" />
                        <span className={styles.detailLabel}>Purchased:</span>
                        <span className={styles.detailValue}>{formatDate(purchaseDate)}</span>
                    </div>
                </div>

                {notes && (
                    <div className={styles.notes}>
                        <strong>Notes:</strong> {notes}
                    </div>
                )}

                <div className={styles.actions}>
                    <button
                        className={styles.editButton}
                        onClick={() => onEdit?.(item)}
                        aria-label={`Edit ${game?.title}`}
                        title="Edit game"
                    >
                        <Pencil size={16} />
                        <span>Edit</span>
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={() => onDelete?.(item)}
                        aria-label={`Delete ${game?.title}`}
                        title="Delete game"
                    >
                        <Trash2 size={16} />
                        <span>Delete</span>
                    </button>

                    {onAddReview && !review && (
                        <button
                            className={styles.reviewButton}
                            onClick={() => onAddReview(item)}
                            title="Add Review"
                        >
                            <MessageSquarePlus size={16} />
                            <span>Review</span>
                        </button>
                    )}
                </div>

                {review && (
                    <div className={styles.reviewBadge} onClick={() => onEditReview?.(review)} role="button" tabIndex={0} title="Edit Review">
                        <StarRating rating={review.rating} readOnly size={14} />
                    </div>
                )}
            </div>
        </motion.article>
    );
}
