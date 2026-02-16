import { useQuery } from '@tanstack/react-query';
import { collectionApi } from '../services/api';

export function useCollection() {
    const { data = [], isLoading, error, refetch } = useQuery({
        queryKey: ['collection'],
        queryFn: collectionApi.fetchCollection
    });

    return {
        data,
        isLoading,
        error: error instanceof Error ? error.message : null,
        refetch
    };
}
