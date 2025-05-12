'use client';

import React, { useState } from 'react';
import type { UserInput, FormErrors } from '@/types';
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
    try {
      const response = await fetch('/api/generate/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate projects');
      }

      const data = await response.json();
      console.log('Generated projects:', data);
    } catch (error) {
      console.error('Error:', error);
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
      [field]: value.split(',').map((item) => item.trim()),
    }));
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        width: '100%',
        maxWidth: isMobile ? '100%' : '600px',
        margin: '0 auto'
      }}
    >
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

      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Projects'}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
