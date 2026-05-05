import type { Candidate } from '@/types/candidate';
import type { FilterState } from '@/types/filters';

/** Pure function: apply all active filters and sort to a candidate list. */
export function applyFilters(candidates: Candidate[], filters: FilterState): Candidate[] {
  let result = [...candidates];
  const q = filters.q.toLowerCase().trim();

  if (q) {
    result = result.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)),
    );
  }

  if (filters.location) {
    result = result.filter((c) =>
      c.location.toLowerCase().includes(filters.location.toLowerCase()),
    );
  }

  if (filters.skill) {
    result = result.filter((c) =>
      c.skills.some((s) => s.toLowerCase() === filters.skill.toLowerCase()),
    );
  }

  if (filters.availability) {
    result = result.filter((c) => c.availability === filters.availability);
  }

  if (filters.status) {
    result = result.filter((c) => c.status === filters.status);
  }

  if (filters.seniority) {
    result = result.filter((c) => c.seniority === filters.seniority);
  }

  // Sort
  switch (filters.sort) {
    case 'score':
      result.sort((a, b) => b.score - a.score);
      break;
    case 'experience':
      result.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
      break;
    case 'recent':
    default:
      result.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      break;
  }

  return result;
}
