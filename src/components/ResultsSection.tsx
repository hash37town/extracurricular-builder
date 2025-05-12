import React from 'react';
import { ProjectIdea, GeneratedEmail, Opportunity } from '@/types';

interface ProjectCardProps {
  project: ProjectIdea;
}

interface ResultsSectionProps {
  projects: ProjectIdea[];
  email: GeneratedEmail | null;
  opportunities: Opportunity[];
  isLoading: boolean;
  error?: string | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-4">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
    <p className="text-gray-600 mb-4">{project.description}</p>
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-900">Required Skills</h4>
        <div className="mt-1 flex flex-wrap gap-2">
          {project.requiredSkills.map((skill: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900">Time Commitment</h4>
        <p className="mt-1 text-sm text-gray-500">{project.timeCommitment}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-900">Impact</h4>
        <p className="mt-1 text-sm text-gray-500">{project.impact}</p>
      </div>
      {project.resources && project.resources.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900">Resources</h4>
          <ul className="mt-1 space-y-1">
            {project.resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const EmailTemplate: React.FC<{ email: GeneratedEmail }> = ({ email }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Subject</h3>
        <p className="mt-1 text-sm text-gray-500">{email.subject}</p>
      </div>
      {email.recipient && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">To</h3>
          <p className="mt-1 text-sm text-gray-500">{email.recipient}</p>
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Body</h3>
        <div className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
          {email.body}
        </div>
      </div>
    </div>
  </div>
);

const ResultsSection: React.FC<ResultsSectionProps> = ({
  projects,
  email,
  opportunities,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!projects.length && !opportunities.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      {projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Ideas</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </section>
      )}

      {email && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample Email</h2>
          <EmailTemplate email={email} />
        </section>
      )}

      {opportunities.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Related Opportunities
          </h2>
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {opportunity.title}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Organization
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {opportunity.organization}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Description
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {opportunity.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Location
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {opportunity.location}
                      </p>
                    </div>
                    {opportunity.deadline && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Deadline
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {opportunity.deadline}
                        </p>
                      </div>
                    )}
                  </div>
                  {opportunity.url && (
                    <div>
                      <a
                        href={opportunity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Learn More
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsSection;
