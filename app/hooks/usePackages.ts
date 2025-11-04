'use client';

import { useEffect, useState } from 'react';
import { ApiResponse } from '@/app/types/api';
import { Package } from '@/app/entity/package';
import { usePackageStore } from '@/app/store/packageStore';

interface UsePackagesReturn {
    packages: Package[];
    loading: boolean;
    error: string | null;
    fetchPackages: () => Promise<void>;
    refetch: () => Promise<void>;
    isFetching: boolean;
}

export const usePackages = (autoFetch = false): UsePackagesReturn => {
    const { setPackages, packages } = usePackageStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const fetchPackages = async (showLoading = true): Promise<void> => {
        if (showLoading) {
            setIsFetching(true);
            setLoading(true);
        }

        try {
            setError(null);
            const res = await fetch('/api/package', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data: ApiResponse<Package[]> = await res.json();

            if (!data.success && data.code === "MISSING_PACKAGE") {
                setPackages([]);
                return;
            }

            setPackages(data.data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            console.error('Error fetching packages:', err);
            setError(errorMessage);
            setPackages([]);
        } finally {
            setIsFetching(false);
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchPackages();
        }
    }, [autoFetch]);

    const refetch = async (): Promise<void> => {
        await fetchPackages(false); // Sin mostrar loading para refetch
    };

    return {
        packages,
        loading,
        error,
        fetchPackages,
        refetch,
        isFetching
    };
};
