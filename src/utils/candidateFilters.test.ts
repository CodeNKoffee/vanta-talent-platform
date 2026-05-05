import { describe, it, expect } from 'vitest';
import { applyFilters } from './candidateFilters';
import type { Candidate } from '@/types/candidate';
import type { FilterState } from '@/types/filters';

const mockCandidates: Candidate[] = [
  {
    id: '1',
    fullName: 'John Doe',
    headline: 'Frontend Developer',
    location: 'New York',
    yearsOfExperience: 5,
    seniority: 'Senior',
    skills: ['React', 'TypeScript'],
    availability: 'Immediate',
    status: 'Open to work',
    score: 85,
    updatedAt: '2024-05-01T10:00:00Z',
    about: '',
    experience: [],
    education: { degree: '', institution: '', year: '2020' },
    languages: [],
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    headline: 'Backend Engineer',
    location: 'London',
    yearsOfExperience: 3,
    seniority: 'Mid',
    skills: ['Node.js', 'PostgreSQL'],
    availability: '2 weeks',
    status: 'Interviewing',
    score: 92,
    updatedAt: '2024-05-02T10:00:00Z',
    about: '',
    experience: [],
    education: { degree: '', institution: '', year: '2021' },
    languages: [],
  }
];

const defaultFilters: FilterState = {
  q: '',
  location: '',
  skill: '',
  availability: '',
  status: '',
  seniority: '',
  sort: 'recent'
};

describe('applyFilters', () => {
  it('should return all candidates when no filters are applied', () => {
    const result = applyFilters(mockCandidates, defaultFilters);
    expect(result).toHaveLength(2);
  });

  it('should filter by search query (name)', () => {
    const result = applyFilters(mockCandidates, { ...defaultFilters, q: 'John' });
    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe('John Doe');
  });

  it('should filter by skill', () => {
    const result = applyFilters(mockCandidates, { ...defaultFilters, skill: 'React' });
    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe('John Doe');
  });

  it('should filter by seniority', () => {
    const result = applyFilters(mockCandidates, { ...defaultFilters, seniority: 'Mid' });
    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe('Jane Smith');
  });

  it('should sort by score descending', () => {
    const result = applyFilters(mockCandidates, { ...defaultFilters, sort: 'score' });
    expect(result[0].fullName).toBe('Jane Smith'); // 92
    expect(result[1].fullName).toBe('John Doe');   // 85
  });
});
