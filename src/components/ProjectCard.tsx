import React from 'react';
import type { ProjectIdea } from '@/types';

interface ProjectCardProps {
  project: ProjectIdea;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-700 mb-4">{project.description}</p>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Skills:</h4>
        <ul className="list-disc list-inside space-y-1">
          {project.requiredSkills.map((skill, index) => (
            <li key={index} className="text-gray-600">{skill}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Time Commitment:</h4>
        <p className="text-gray-600">{project.timeCommitment}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Impact:</h4>
        <p className="text-gray-600">{project.impact}</p>
      </div>

      {project.resources && project.resources.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Resources:</h4>
          <ul className="list-disc list-inside space-y-1">
            {project.resources.map((resource, index) => (
              <li key={index} className="text-gray-600">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
