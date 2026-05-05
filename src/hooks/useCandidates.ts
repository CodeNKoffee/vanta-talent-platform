import { useEffect, useMemo, useState } from 'react';
import { fetchCandidates } from '@/services/candidateService';
import type { Candidate } from '@/types/candidate';
import type { FilterState } from '@/types/filters';
import { applyFilters } from '@/utils/candidateFilters';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseCandidatesResult {
  candidates: Candidate[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  retry: () => void;
}

export function useCandidates(filters: FilterState): UseCandidatesResult {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetchCandidates()
      .then((data) => {
        if (!cancelled) {
          setAllCandidates(data);
          setStatus('success');
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [version]);

  const candidates = useMemo(
    () => (status === 'success' ? applyFilters(allCandidates, filters) : []),
    [allCandidates, filters, status],
  );

  return {
    candidates,
    total: candidates.length,
    isLoading: status === 'loading' || status === 'idle',
    isError: status === 'error',
    error,
    retry: () => setVersion((v) => v + 1),
  };
}
