import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { reviewsApi } from '../services/api';
import type { ReviewFormData, UserCollectionItem } from '../types';
import { StarRating } from './StarRating';
import styles from './AddGameModal.module.css'; // Reusing styles

interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    gameItem: UserCollectionItem | null;
}

export function AddReviewModal({ isOpen, onClose, onSuccess, gameItem }: AddReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !gameItem) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const formData: ReviewFormData = {
                userCollectionItemId: gameItem.id,
                rating,
                reviewText
            };

            await reviewsApi.createReview(formData);
            onSuccess();
            onClose();
            // Reset
            setRating(5);
            setReviewText('');
        } catch (err: any) {
            console.error('Failed to add review:', err);
            setError(err.response?.data || 'Failed to add review. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Review: {gameItem.game?.title}</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Rating</label>
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                            <StarRating
                                rating={rating}
                                onRatingChange={setRating}
                                size={32}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="reviewText">
                            Review <span className={styles.required}>*</span>
                        </label>
                        <textarea
                            id="reviewText"
                            required
                            className={styles.textarea}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="What do you think about this game?"
                            minLength={10}
                            rows={5}
                        />
                        <span className={styles.helpText}>Min 10 characters</span>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            {isLoading ? 'Saving...' : (
                                <>
                                    <Save size={20} />
                                    Save Review
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
