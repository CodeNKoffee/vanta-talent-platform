import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CandidateCard } from './CandidateCard';
import { BrowserRouter } from 'react-router-dom';
import { useAppContext } from '@/store/AppContext';
import type { Candidate } from '@/types/candidate';

vi.mock('@/store/AppContext', () => ({
  useAppContext: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCandidate: Candidate = {
  id: '1',
  fullName: 'John Doe',
  headline: 'Frontend Developer',
  location: 'New York',
  yearsOfExperience: 5,
  seniority: 'Senior',
  skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'HTML', 'GraphQL'],
  availability: 'Immediate',
  status: 'Open to work',
  score: 85,
  updatedAt: new Date().toISOString(),
  about: '',
  experience: [],
  education: { degree: '', institution: '', year: 2020 },
  languages: [],
};

describe('CandidateCard', () => {
  it('renders candidate information correctly', () => {
    (useAppContext as any).mockReturnValue({
      isShortlisted: () => false,
      isRejected: () => false,
      getStatus: (_id: string, s: string) => s,
    });

    render(
      <BrowserRouter>
        <CandidateCard candidate={mockCandidate} />
      </BrowserRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Open to work')).toBeInTheDocument();
  });

  it('navigates to candidate profile on click', () => {
    render(
      <BrowserRouter>
        <CandidateCard candidate={mockCandidate} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/candidate/1');
  });

  it('shows shortlisted ribbon when candidate is shortlisted', () => {
    (useAppContext as any).mockReturnValue({
      isShortlisted: () => true,
      isRejected: () => false,
      getStatus: (_id: string, s: string) => s,
    });

    render(
      <BrowserRouter>
        <CandidateCard candidate={mockCandidate} />
      </BrowserRouter>
    );

    expect(screen.getByText('⋆ Shortlisted')).toBeInTheDocument();
  });
});
