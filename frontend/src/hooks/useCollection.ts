import { useState, useEffect } from 'react';
import { collectionApi } from '../services/api';
import type { UserCollectionItem } from '../types';

export function useCollection() {
    const [data, setData] = useState<UserCollectionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const items = await collectionApi.fetchCollection();
            setData(items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch collection');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, isLoading, error, refetch: fetchData };
}
