'use client';

import React from 'react';
import type { ResultsSectionProps } from '@/types';

const ResultsSection: React.FC<ResultsSectionProps> = ({
  projects = [],
  email = null,
  opportunities = [],
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (projects.length === 0 && !email && opportunities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Ideas</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                {project.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Skills Involved:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Impact:</span> {project.impact}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Timeline:</span>{' '}
                    {project.timeline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {opportunities.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Related Opportunities
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {opportunity.title}
                </h3>
                <p className="text-gray-500 mb-2">{opportunity.organization}</p>
                <p className="text-gray-600 mb-4">{opportunity.description}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {opportunity.type}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {email && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Generated Email
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {email.subject}
            </h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{email.body}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsSection;
