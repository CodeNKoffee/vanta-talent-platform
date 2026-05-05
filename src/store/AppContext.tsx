import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import type { CandidateStatus } from '@/types/candidate';

// ─── State ──────────────────────────────────────────────────────────────────

interface AppState {
  shortlistedIds: Set<string>;
  rejectedIds: Set<string>;
  statusOverrides: Record<string, CandidateStatus>;
}

const STORAGE_KEY = 'vanta:appState';

function loadFromStorage(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      shortlistedIds: new Set<string>(parsed.shortlistedIds ?? []),
      rejectedIds: new Set<string>(parsed.rejectedIds ?? []),
      statusOverrides: parsed.statusOverrides ?? {},
    };
  } catch {
    return {};
  }
}

function initialState(): AppState {
  const stored = loadFromStorage();
  return {
    shortlistedIds: stored.shortlistedIds ?? new Set(),
    rejectedIds: stored.rejectedIds ?? new Set(),
    statusOverrides: stored.statusOverrides ?? {},
  };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SHORTLIST'; id: string }
  | { type: 'UNSHORTLIST'; id: string }
  | { type: 'REJECT'; id: string }
  | { type: 'UNREJECT'; id: string }
  | { type: 'SET_STATUS'; id: string; status: CandidateStatus };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SHORTLIST': {
      const next = new Set(state.shortlistedIds);
      next.add(action.id);
      const rejected = new Set(state.rejectedIds);
      rejected.delete(action.id);
      return { ...state, shortlistedIds: next, rejectedIds: rejected };
    }
    case 'UNSHORTLIST': {
      const next = new Set(state.shortlistedIds);
      next.delete(action.id);
      return { ...state, shortlistedIds: next };
    }
    case 'REJECT': {
      const next = new Set(state.rejectedIds);
      next.add(action.id);
      const shortlisted = new Set(state.shortlistedIds);
      shortlisted.delete(action.id);
      return { ...state, rejectedIds: next, shortlistedIds: shortlisted };
    }
    case 'UNREJECT': {
      const next = new Set(state.rejectedIds);
      next.delete(action.id);
      return { ...state, rejectedIds: next };
    }
    case 'SET_STATUS': {
      return {
        ...state,
        statusOverrides: { ...state.statusOverrides, [action.id]: action.status },
      };
    }
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  shortlist: (id: string) => void;
  unshortlist: (id: string) => void;
  reject: (id: string) => void;
  unreject: (id: string) => void;
  setStatus: (id: string, status: CandidateStatus) => void;
  isShortlisted: (id: string) => boolean;
  isRejected: (id: string) => boolean;
  getStatus: (id: string, fallback: CandidateStatus) => CandidateStatus;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        shortlistedIds: [...state.shortlistedIds],
        rejectedIds: [...state.rejectedIds],
        statusOverrides: state.statusOverrides,
      }),
    );
  }, [state]);

  const shortlist = useCallback((id: string) => dispatch({ type: 'SHORTLIST', id }), []);
  const unshortlist = useCallback((id: string) => dispatch({ type: 'UNSHORTLIST', id }), []);
  const reject = useCallback((id: string) => dispatch({ type: 'REJECT', id }), []);
  const unreject = useCallback((id: string) => dispatch({ type: 'UNREJECT', id }), []);
  const setStatus = useCallback(
    (id: string, status: CandidateStatus) => dispatch({ type: 'SET_STATUS', id, status }),
    [],
  );

  const isShortlisted = useCallback((id: string) => state.shortlistedIds.has(id), [state.shortlistedIds]);
  const isRejected = useCallback((id: string) => state.rejectedIds.has(id), [state.rejectedIds]);
  const getStatus = useCallback(
    (id: string, fallback: CandidateStatus) => state.statusOverrides[id] ?? fallback,
    [state.statusOverrides],
  );

  return (
    <AppContext.Provider
      value={{ state, shortlist, unshortlist, reject, unreject, setStatus, isShortlisted, isRejected, getStatus }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}
