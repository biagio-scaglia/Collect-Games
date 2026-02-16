import { useQuery } from '@tanstack/react-query';
import { consolesApi } from '../services/api';

export function useConsoles() {
    const { data = [], isLoading, error } = useQuery({
        queryKey: ['consoles'],
        queryFn: consolesApi.fetchConsoles
    });

    return {
        data,
        isLoading,
        error: error instanceof Error ? error.message : null
    };
}
