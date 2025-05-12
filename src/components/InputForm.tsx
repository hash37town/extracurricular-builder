import React, { useState } from 'react';
import type { UserInput, FormErrors } from '@/types';

interface InputFormProps {
  onSubmit: (data: UserInput) => Promise<void>;
}

const GRADE_LEVELS = [
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'College Freshman',
  'College Sophomore',
  'College Junior',
  'College Senior',
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<UserInput>({
    gradeLevel: '',
    location: '',
    interests: [],
  });
  const [interestInput, setInterestInput] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.gradeLevel) {
      newErrors.gradeLevel = 'Grade level is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'At least one interest is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInterest = interestInput.trim();

    if (!trimmedInterest) {
      return;
    }

    if (formData.interests.includes(trimmedInterest)) {
      setErrors(prev => ({
        ...prev,
        interests: 'This interest has already been added',
      }));
      return;
    }

    if (formData.interests.length >= 5) {
      setErrors(prev => ({
        ...prev,
        interests: 'Maximum 5 interests allowed',
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, trimmedInterest],
    }));
    setInterestInput('');
    setErrors(prev => ({ ...prev, interests: undefined }));
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit form. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700">
          Grade Level
        </label>
        <select
          id="gradeLevel"
          value={formData.gradeLevel}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, gradeLevel: e.target.value }));
            setErrors(prev => ({ ...prev, gradeLevel: undefined }));
          }}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
            errors.gradeLevel ? 'border-red-300' : ''
          }`}
        >
          <option value="">Select grade level</option>
          {GRADE_LEVELS.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        {errors.gradeLevel && (
          <p className="mt-2 text-sm text-red-600">{errors.gradeLevel}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, location: e.target.value }));
            setErrors(prev => ({ ...prev, location: undefined }));
          }}
          placeholder="City, State or Country"
          className={`mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
            errors.location ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.location && (
          <p className="mt-2 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
          Interests
        </label>
        <div className="mt-1">
          <div className="flex space-x-2">
            <input
              type="text"
              id="interests"
              value={interestInput}
              onChange={(e) => {
                setInterestInput(e.target.value);
                setErrors(prev => ({ ...prev, interests: undefined }));
              }}
              placeholder="Add an interest"
              className={`block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${
                errors.interests ? 'border-red-300' : 'border-gray-300'
              }`}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest(e);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </div>
          {errors.interests && (
            <p className="mt-2 text-sm text-red-600">{errors.interests}</p>
          )}
          {formData.interests.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-900 focus:outline-none"
                  >
                    <span className="sr-only">Remove {interest}</span>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </>
          ) : (
            'Generate Ideas'
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
