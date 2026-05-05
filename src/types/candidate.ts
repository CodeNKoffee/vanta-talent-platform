// ─── Candidate Entity ──────────────────────────────────────────────────────

export type CandidateStatus =
  | 'Open to work'
  | 'Interviewing'
  | 'Hired'
  | 'Not looking';

export type Availability =
  | 'Immediate'
  | '2 weeks'
  | '1 month'
  | '3 months';

export type Seniority = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal';

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  period: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  yearsOfExperience: number;
  seniority: Seniority;
  skills: string[];
  availability: Availability;
  updatedAt: string; // ISO date string YYYY-MM-DD
  status: CandidateStatus;
  score: number; // 0–100
  // Optional enriched fields
  about: string;
  experience: ExperienceEntry[];
  education: Education;
  languages: string[];
  salaryExpectation?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
}

// ─── UI-augmented Candidate (with app state overlaid) ──────────────────────

export interface CandidateWithState extends Candidate {
  isShortlisted: boolean;
  isRejected: boolean;
  runtimeStatus?: CandidateStatus; // overrides status when changed via UI
}
