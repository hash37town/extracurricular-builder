import type { UserInput, Opportunity } from '@/types';

// Mock data for opportunities
const mockOpportunities: Opportunity[] = [
  {
    title: 'Science Fair Competition',
    organization: 'National Science Foundation',
    description: 'Annual science fair for high school students to showcase their research projects.',
    location: 'National',
    type: 'competition',
    deadline: '2025-12-31',
    url: 'https://example.com/science-fair',
  },
  {
    title: 'Youth Leadership Program',
    organization: 'Community Center',
    description: 'Leadership development program for high school students interested in community service.',
    location: 'Local',
    type: 'program',
    deadline: '2025-09-01',
    url: 'https://example.com/leadership',
  },
  {
    title: 'Tech Internship',
    organization: 'Tech Company',
    description: 'Summer internship program for students interested in software development and technology.',
    location: 'Remote',
    type: 'internship',
    deadline: '2025-03-15',
    url: 'https://example.com/internship',
  },
  {
    title: 'Environmental Conservation Project',
    organization: 'Green Earth',
    description: 'Volunteer program focused on local environmental conservation efforts.',
    location: 'Local',
    type: 'volunteer',
    deadline: '2025-06-30',
    url: 'https://example.com/conservation',
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

// Helper function to check if an opportunity matches user location
function matchesLocation(opportunity: Opportunity, userLocation: string): boolean {
  const opportunityLocation = opportunity.location.toLowerCase();
  const location = userLocation.toLowerCase();
  
  return (
    opportunityLocation === 'remote' ||
    opportunityLocation === 'national' ||
    opportunityLocation.includes(location) ||
    location.includes(opportunityLocation)
  );
}

// Main function to filter opportunities based on user input
export async function findOpportunities(input: UserInput): Promise<Opportunity[]> {
  try {
    // Filter opportunities based on interests and location
    const filteredOpportunities = mockOpportunities.filter(
      opportunity =>
        matchesInterests(opportunity, input.interests) &&
        matchesLocation(opportunity, input.location)
    );

    return filteredOpportunities;
  } catch (error) {
    console.error('Error finding opportunities:', error);
    return [];
  }
}
