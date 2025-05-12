'use client';

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultsSection from '@/components/ResultsSection';
import Toast from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import AdUnit from '@/components/AdUnit';
import type { ProjectIdea, GeneratedEmail, UserInput, Opportunity } from '@/types';

export default function Home() {
  const [projects, setProjects] = useState<ProjectIdea[]>([]);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setToast(null);

    try {
      // Fetch project ideas
      const projectsResponse = await fetch('/api/generate/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!projectsResponse.ok) {
        throw new Error('Failed to generate project ideas');
      }

      const projectsData = await projectsResponse.json();
      setProjects(projectsData.projects);

      // Fetch email template
      const emailResponse = await fetch('/api/generate/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, projects: projectsData.projects }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to generate email template');
      }

      const emailData = await emailResponse.json();
      setEmail(emailData);

      // Fetch opportunities
      const opportunitiesResponse = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!opportunitiesResponse.ok) {
        throw new Error('Failed to fetch opportunities');
      }

      const opportunitiesData = await opportunitiesResponse.json();
      setOpportunities(opportunitiesData.opportunities);

      setToast({
        message: 'Successfully generated ideas and opportunities!',
        type: 'success',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setToast({
        message: 'Failed to generate content. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                An unexpected error occurred. Please try again later.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              GPT-Powered Extracurricular Builder
            </h1>
            <p className="text-xl text-gray-600">
              Generate personalized extracurricular project ideas and opportunities based on your interests
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <InputForm onSubmit={handleSubmit} />
              </div>

              <div className="mt-8">
                <ResultsSection
                  projects={projects}
                  email={email}
                  opportunities={opportunities}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <AdUnit
                adClient="ca-pub-YOUR_CLIENT_ID"
                adSlot="YOUR_AD_SLOT"
                adFormat="auto"
                fullWidthResponsive={true}
              />
            </div>
          </div>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={5000}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </ErrorBoundary>
  );
}
