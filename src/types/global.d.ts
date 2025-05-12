import React from 'react';

declare module '@/types' {
  export interface ProjectIdea {
    title: string;
    description: string;
    skills: string[];
    impact: string;
    timeline: string;
  }

  export interface GeneratedEmail {
    subject: string;
    body: string;
  }

  export interface Opportunity {
    title: string;
    organization: string;
    description: string;
    type: 'competition' | 'program' | 'internship' | 'volunteer';
  }

  export interface UserInput {
    name: string;
    interests: string[];
    skills: string[];
    gradeLevel: string;
    location: string;
  }

  export interface ResultsSectionProps {
    projects?: ProjectIdea[];
    email?: GeneratedEmail | null;
    opportunities?: Opportunity[];
    isLoading?: boolean;
    error?: string | null;
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
