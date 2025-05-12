import type { UserInput, Opportunity } from '@/types';

// Mock data for opportunities
export const mockOpportunities: Opportunity[] = [
  {
    title: 'National Science Fair',
    organization: 'National Science Foundation',
    description: 'Annual science fair for high school students to showcase their research projects.',
    type: 'competition',
  },
  {
    title: 'Tech Internship Program',
    organization: 'Tech Innovators Inc.',
    description: 'Summer internship program for high school students interested in software development.',
    type: 'internship',
  },
  {
    title: 'Environmental Research Program',
    organization: 'Green Earth Foundation',
    description: 'Research program focused on environmental conservation and sustainability.',
    type: 'program',
  },
  {
    title: 'Math Olympiad',
    organization: 'International Math Society',
    description: 'International mathematics competition for high school students.',
    type: 'competition',
  },
  {
    title: 'Art Workshop Series',
    organization: 'Creative Arts Center',
    description: 'Weekly workshops covering various art techniques and mediums.',
    type: 'program',
  },
];

// Helper function to check if an opportunity matches user interests
function matchesInterests(opportunity: Opportunity, interests: string[]): boolean {
  return interests.some(interest =>
    opportunity.description.toLowerCase().includes(interest.toLowerCase()) ||
    opportunity.title.toLowerCase().includes(interest.toLowerCase()) ||
    opportunity.organization.toLowerCase().includes(interest.toLowerCase())
  );
}

// Main function to filter opportunities based on user input
export async function findOpportunities(input: UserInput): Promise<Opportunity[]> {
  try {
    // Filter opportunities based on interests
    const filteredOpportunities = mockOpportunities.filter(
      opportunity =>
        matchesInterests(opportunity, input.interests)
    );

    return filteredOpportunities;
  } catch (error) {
    console.error('Error finding opportunities:', error);
    return [];
  }
}

export function getOpportunities(userInput: UserInput): Opportunity[] {
  // For now, just return all opportunities
  // In a real app, this would filter based on user interests and location
  return mockOpportunities;
}
