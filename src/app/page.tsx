import React from 'react';
import InputForm from '@/components/InputForm';
import ResultsSection from '@/components/ResultsSection';
import AdUnit from '@/components/AdUnit';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Extracurricular Activity Builder
          </h1>
          <p className="text-lg text-gray-600">
            Generate personalized extracurricular activity suggestions based on
            your interests and goals
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <InputForm />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-3">
            <ResultsSection />
          </div>
          <div className="lg:col-span-1">
            <AdUnit
              adClient={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
              adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || ''}
              adFormat="auto"
              fullWidthResponsive={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
