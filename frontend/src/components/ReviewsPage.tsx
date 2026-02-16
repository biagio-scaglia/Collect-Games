import { useState, useEffect } from 'react';
import { reviewsApi } from '../services/api';
import type { Review } from '../types';
import { ReviewCard } from './ReviewCard';
import styles from '../App.module.css'; // Check if we can reuse

export function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const data = await reviewsApi.fetchReviews();
            setReviews(data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (review: Review) => {
        if (window.confirm('Delete this review?')) {
            await reviewsApi.deleteReview(review.id);
            fetchReviews();
        }
    };

    return (
        <div className="reviews-page">
            {isLoading ? (
                <div className={styles.loading}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>⭐</div>
                    <p>No reviews yet. Review games from your collection!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {reviews.map(review => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onDelete={handleDelete}
                            showGameInfo={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
