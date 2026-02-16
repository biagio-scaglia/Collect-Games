import { Star } from 'lucide-react';
import styles from './StarRating.module.css';

interface StarRatingProps {
    rating: number; // 0-5
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: number;
}

export function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    readOnly = false,
    size = 20
}: StarRatingProps) {
    const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

    return (
        <div className={styles.starContainer}>
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`${styles.starButton} ${readOnly ? styles.readOnly : ''}`}
                    onClick={() => !readOnly && onRatingChange?.(star)}
                    disabled={readOnly}
                    aria-label={`Rate ${star} out of ${maxRating} stars`}
                >
                    <Star
                        size={size}
                        className={`${styles.star} ${star <= rating ? styles.filled : styles.empty}`}
                        fill={star <= rating ? "var(--snes-yellow)" : "none"}
                    />
                </button>
            ))}
        </div>
    );
}
