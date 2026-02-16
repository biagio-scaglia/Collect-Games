import { useState, useEffect } from 'react';
import { consolesApi } from '../services/api';
import type { Console } from '../types';

export function useConsoles() {
    const [data, setData] = useState<Console[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const consoles = await consolesApi.fetchConsoles();
                setData(consoles);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch consoles');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, isLoading, error };
}
