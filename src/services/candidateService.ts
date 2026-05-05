import type { Candidate } from '@/types/candidate';
import rawData from '@/data/candidates.json';

// Cast JSON to typed array once at module level
const ALL_CANDIDATES = rawData as Candidate[];

const SIMULATED_LATENCY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all candidates with simulated network latency. */
export async function fetchCandidates(): Promise<Candidate[]> {
  await delay(SIMULATED_LATENCY_MS);
  return [...ALL_CANDIDATES];
}

/** Fetch a single candidate by ID. Throws if not found. */
export async function fetchCandidateById(id: string): Promise<Candidate> {
  await delay(SIMULATED_LATENCY_MS);
  const candidate = ALL_CANDIDATES.find((c) => c.id === id);
  if (!candidate) {
    throw new Error(`Candidate with id "${id}" not found.`);
  }
  return { ...candidate };
}

/** Derive unique filter option values from the full dataset. */
export function getCandidateMeta() {
  const locations = [...new Set(ALL_CANDIDATES.map((c) => c.location))].sort();
  const allSkills = ALL_CANDIDATES.flatMap((c) => c.skills);
  const skills = [...new Set(allSkills)].sort();
  return { locations, skills, total: ALL_CANDIDATES.length };
}
