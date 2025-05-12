'use client';

import React from 'react';
import InputForm from '@/components/InputForm';
import ResultsSection from '@/components/ResultsSection';
import AdUnit from '@/components/AdUnit';
import { useViewport } from '@/hooks/useViewport';

export default function Home() {
  const { width } = useViewport();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const containerWidth = isMobile ? '95%' : isTablet ? '85%' : '75%';

  return (
    <main className="min-h-screen bg-gray-50">
      <div 
        className="min-h-screen py-8 md:py-12"
        style={{
          margin: '0 auto',
          width: containerWidth,
          maxWidth: '1400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <header className="w-full text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Extracurricular Activity Builder
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Generate personalized extracurricular activity suggestions based on
            your interests and goals
          </p>
        </header>

        <div className="w-full" style={{ maxWidth: isMobile ? '100%' : '800px' }}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <InputForm />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
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
