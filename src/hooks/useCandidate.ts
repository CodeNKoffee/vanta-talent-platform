import { useEffect, useState } from 'react';
import { fetchCandidateById } from '@/services/candidateService';
import type { Candidate } from '@/types/candidate';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseCandidateResult {
  candidate: Candidate | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useCandidate(id: string | undefined): UseCandidateResult {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setStatus('loading');
    setCandidate(null);
    setError(null);

    fetchCandidateById(id)
      .then((data) => {
        if (!cancelled) {
          setCandidate(data);
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
  }, [id]);

  return {
    candidate,
    isLoading: status === 'loading' || status === 'idle',
    isError: status === 'error',
    error,
  };
}
