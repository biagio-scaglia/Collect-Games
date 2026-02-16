import { Trash2, Pencil, Calendar, Package } from 'lucide-react';
import type { Review } from '../types';
import { StarRating } from './StarRating';
import { getConsoleImage } from '../utils/consoleImages';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
    review: Review;
    onEdit?: (review: Review) => void;
    onDelete?: (review: Review) => void;
    showGameInfo?: boolean;
}

export function ReviewCard({ review, onEdit, onDelete, showGameInfo = false }: ReviewCardProps) {
    const game = review.userCollectionItem?.game;

    return (
        <div className={styles.card}>
            {showGameInfo && game && (
                <div className={styles.gameInfo}>
                    <div className={styles.gameHeader}>
                        <h3 className={styles.gameTitle}>{game.title}</h3>
                        <div className={styles.platformBadge}>
                            {getConsoleImage(game.platform) ? (
                                <img
                                    src={getConsoleImage(game.platform) || ''}
                                    alt={game.platform}
                                    className={styles.consoleIcon}
                                />
                            ) : (
                                <Package size={12} />
                            )}
                            <span>{game.platform}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.header}>
                <StarRating rating={review.rating} readOnly size={18} />
                <div className={styles.date}>
                    <Calendar size={14} />
                    {new Date(review.reviewDate).toLocaleDateString()}
                </div>
            </div>

            <div className={styles.content}>
                <p className={styles.text}>{review.reviewText}</p>
            </div>

            {(onEdit || onDelete) && (
                <div className={styles.actions}>
                    {onEdit && (
                        <button
                            className={styles.actionButton}
                            onClick={() => onEdit(review)}
                            title="Edit Review"
                        >
                            <Pencil size={16} />
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => onDelete(review)}
                            title="Delete Review"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
