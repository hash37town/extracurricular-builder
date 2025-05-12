'use client';

import React, { useState } from 'react';
import type { UserInput, FormErrors } from '@/types';

const InputForm: React.FC = () => {
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    grade: '',
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
    if (!formData.grade) newErrors.grade = 'Grade is required';
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
            Grade
          </label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.grade ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          />
          {errors.grade && <p className="mt-1 text-sm text-red-500">{errors.grade}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
            Interests (comma-separated)
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests.join(', ')}
            onChange={(e) => handleArrayInputChange(e, 'interests')}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.interests ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          />
          {errors.interests && <p className="mt-1 text-sm text-red-500">{errors.interests}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills.join(', ')}
            onChange={(e) => handleArrayInputChange(e, 'skills')}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.skills ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          />
          {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
        </div>

        <div>
          <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700">
            Grade Level
          </label>
          <input
            type="text"
            id="gradeLevel"
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.gradeLevel ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          />
          {errors.gradeLevel && <p className="mt-1 text-sm text-red-500">{errors.gradeLevel}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
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
