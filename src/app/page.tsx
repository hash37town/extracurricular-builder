'use client';

import React from 'react';
import InputForm from '@/components/InputForm';
import AdUnit from '@/components/AdUnit';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 lg:p-24 bg-gray-50">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Extracurricular Project Builder
        </h1>
        <p className="text-lg text-center mb-12 text-gray-600">
          Generate personalized project ideas based on your interests and skills
        </p>
        <InputForm />
      </div>
      <AdUnit />
    </main>
  );
}
