import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsSection from '@/components/ResultsSection';
import type { OpportunityType } from '@/types';

describe('ResultsSection', () => {
  const mockProjects = [
    {
      title: 'Test Project',
      description: 'A test project description',
      requiredSkills: ['Skill 1', 'Skill 2'],
      timeCommitment: '2 hours per week',
      impact: 'High impact on community',
      resources: [
        { url: 'https://example.com', title: 'Resource 1' },
      ],
    },
  ];

  const mockEmail = {
    subject: 'Test Subject',
    recipient: 'test@example.com',
    body: 'Test email body',
  };

  const mockOpportunities = [
    {
      title: 'Test Opportunity',
      organization: 'Test Org',
      description: 'A test opportunity description',
      location: 'Remote',
      type: 'volunteer' as OpportunityType,
      deadline: '2025-12-31',
      url: 'https://example.com/opportunity',
    },
  ];

  it('renders loading state', () => {
    render(
      <ResultsSection
        projects={[]}
        email={null}
        opportunities={[]}
        isLoading={true}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(
      <ResultsSection
        projects={[]}
        email={null}
        opportunities={[]}
        isLoading={false}
        error="Test error message"
      />
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders projects section', () => {
    render(
      <ResultsSection
        projects={mockProjects}
        email={null}
        opportunities={[]}
        isLoading={false}
      />
    );

    expect(screen.getByText('Project Ideas')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
    expect(screen.getByText('Skill 1')).toBeInTheDocument();
    expect(screen.getByText('Skill 2')).toBeInTheDocument();
  });

  it('renders email section', () => {
    render(
      <ResultsSection
        projects={[]}
        email={mockEmail}
        opportunities={[]}
        isLoading={false}
      />
    );

    expect(screen.getByText('Sample Email')).toBeInTheDocument();
    expect(screen.getByText('Test Subject')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test email body')).toBeInTheDocument();
  });

  it('renders opportunities section', () => {
    render(
      <ResultsSection
        projects={[]}
        email={null}
        opportunities={mockOpportunities}
        isLoading={false}
      />
    );

    expect(screen.getByText('Related Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Test Opportunity')).toBeInTheDocument();
    expect(screen.getByText('Test Org')).toBeInTheDocument();
    expect(screen.getByText('A test opportunity description')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(screen.getByText('2025-12-31')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn More' })).toHaveAttribute(
      'href',
      'https://example.com/opportunity'
    );
  });

  it('renders nothing when no data is available', () => {
    const { container } = render(
      <ResultsSection
        projects={[]}
        email={null}
        opportunities={[]}
        isLoading={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
