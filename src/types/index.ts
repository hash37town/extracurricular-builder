export interface UserInput {
  gradeLevel: string;
  location: string;
  interests: string[];
}

export interface Resource {
  url: string;
  title: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  requiredSkills: string[];
  timeCommitment: string;
  impact: string;
  resources?: Resource[];
}

export interface GeneratedEmail {
  subject: string;
  recipient?: string;
  body: string;
}

export type OpportunityType = 'competition' | 'program' | 'internship' | 'volunteer';

export interface Opportunity {
  title: string;
  organization: string;
  description: string;
  location: string;
  type: OpportunityType;
  deadline?: string;
  url?: string;
}

export type FormErrors = Partial<Record<keyof UserInput | 'submit', string>>;
