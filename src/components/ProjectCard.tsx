'use client';

import React from 'react';
import type { ProjectIdea } from '@/types';

interface ProjectCardProps {
  project: ProjectIdea;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      {project.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) => (
              <span
                key={index}
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
          <span className="font-medium">Timeline:</span> {project.timeline}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
