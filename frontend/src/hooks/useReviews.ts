import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '../services/api';

export function useReviews() {
    const { data: reviews = [], isLoading, error, refetch } = useQuery({
        queryKey: ['reviews'],
        queryFn: reviewsApi.fetchReviews
    });

    const getReviewByItemId = useCallback((itemId: number) => {
        return reviews.find(r => r.userCollectionItemId === itemId);
    }, [reviews]);

    return {
        reviews,
        isLoading,
        error: error instanceof Error ? error.message : null,
        refetch,
        getReviewByItemId
    };
}
