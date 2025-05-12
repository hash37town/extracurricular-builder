import React from 'react';

declare module '@/types' {
  export interface ProjectIdea {
    title: string;
    description: string;
    requiredSkills: string[];
    timeCommitment: string;
    impact: string;
    resources?: Array<{
      title: string;
      url: string;
    }>;
  }

  export interface GeneratedEmail {
    subject: string;
    body: string;
    recipient?: string;
  }

  export interface Opportunity {
    title: string;
    organization: string;
    description: string;
    location: string;
    type: 'competition' | 'program' | 'internship';
    deadline?: string;
    url?: string;
  }

  export interface UserInput {
    gradeLevel: string;
    location: string;
    interests: string[];
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface Window {
    adsbygoogle: any[];
  }
}

export {};
