import { useState, useEffect, useCallback } from 'react';
import { reviewsApi } from '../services/api';
import type { Review, ReviewFormData } from '../types';

interface UseReviewsResult {
    reviews: Review[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    addReview: (data: ReviewFormData) => Promise<Review>;
    updateReview: (id: number, data: Partial<ReviewFormData>) => Promise<Review>;
    deleteReview: (id: number) => Promise<void>;
    getReviewByItemId: (itemId: number) => Review | undefined;
}

export function useReviews(): UseReviewsResult {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await reviewsApi.fetchReviews();
            setReviews(data);
        } catch (err) {
            setError('Failed to fetch reviews');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const addReview = async (data: ReviewFormData) => {
        const newReview = await reviewsApi.createReview(data);
        setReviews(prev => [newReview, ...prev]);
        return newReview;
    };

    const updateReview = async (id: number, data: Partial<ReviewFormData>) => {
        const updatedReview = await reviewsApi.updateReview(id, data);
        setReviews(prev => prev.map(r => r.id === id ? updatedReview : r));
        return updatedReview;
    };

    const deleteReview = async (id: number) => {
        await reviewsApi.deleteReview(id);
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    const getReviewByItemId = useCallback((itemId: number) => {
        return reviews.find(r => r.userCollectionItemId === itemId);
    }, [reviews]);

    return {
        reviews,
        isLoading,
        error,
        refetch: fetchReviews,
        addReview,
        updateReview,
        deleteReview,
        getReviewByItemId
    };
}
