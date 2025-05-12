export interface UserInput {
  name: string;
  grade: string;
  interests: string[];
  skills: string[];
  gradeLevel: string;
  location: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  skills: string[];
  impact: string;
  timeline: string;
}

export interface Opportunity {
  title: string;
  organization: string;
  description: string;
  type: 'competition' | 'program' | 'internship' | 'volunteer';
}

export interface EmailPrompt {
  student: UserInput;
  opportunity: Opportunity;
}

export interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface ResultsSectionProps {
  projects?: ProjectIdea[];
  email?: GeneratedEmail | null;
  opportunities?: Opportunity[];
  isLoading?: boolean;
  error?: string | null;
}

export type OpportunityType = 'competition' | 'program' | 'internship' | 'volunteer';

export type FormErrors = Partial<Record<keyof UserInput | 'submit', string>>;
