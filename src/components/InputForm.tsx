'use client';

import React, { useState } from 'react';
import type { UserInput, FormErrors, ProjectIdea } from '@/types';
import { useViewport } from '@/hooks/useViewport';

const InputForm: React.FC = () => {
  const { width } = useViewport();
  const isMobile = width < 768;

  const [formData, setFormData] = useState<UserInput>({
    name: '',
    interests: [],
    skills: [],
    gradeLevel: '',
    location: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectIdea[]>([]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (formData.interests.length === 0) newErrors.interests = 'At least one interest is required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    if (!formData.gradeLevel) newErrors.gradeLevel = 'Grade level is required';
    if (!formData.location) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setProjects([]);
    setErrors({});

    try {
      // Debug: Log form data being sent
      console.log('Sending form data:', formData);

      const response = await fetch('/api/generate/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Debug: Log raw response
      console.log('Raw response:', response);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate projects');
      }

      if (!Array.isArray(data)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }

      setProjects(data);
    } catch (error) {
      console.error('Error in form submission:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error instanceof Error ? error.message : 'Failed to generate projects. Please try again.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserInput) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(',').map((item) => item.trim()).filter(Boolean),
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-md shadow-sm ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Grade Level
            </label>
            <input
              type="text"
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-md shadow-sm ${
                errors.gradeLevel ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
              placeholder="e.g., High School Junior"
            />
            {errors.gradeLevel && <p className="mt-1 text-sm text-red-500">{errors.gradeLevel}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
              Interests (comma-separated)
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'interests')}
              className={`w-full px-4 py-2 rounded-md shadow-sm ${
                errors.interests ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
              placeholder="e.g., programming, art, music"
            />
            {errors.interests && <p className="mt-1 text-sm text-red-500">{errors.interests}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'skills')}
              className={`w-full px-4 py-2 rounded-md shadow-sm ${
                errors.skills ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
              placeholder="e.g., Python, drawing, teamwork"
            />
            {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-md shadow-sm ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
              placeholder="Your city or region"
            />
            {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
          </div>
        </div>

        {errors.submit && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Generating Projects...</span>
              </div>
            ) : (
              'Generate Projects'
            )}
          </button>
        </div>
      </form>

      {projects.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Generated Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
              <p className="mt-2 text-gray-600">{project.description}</p>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">Skills to Develop:</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {project.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">Impact:</h4>
                <p className="mt-1 text-gray-600">{project.impact}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">Timeline:</h4>
                <p className="mt-1 text-gray-600">{project.timeline}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputForm;
