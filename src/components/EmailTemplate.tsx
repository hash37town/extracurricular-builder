'use client';

import React from 'react';
import type { GeneratedEmail } from '@/types';

interface EmailTemplateProps {
  email: GeneratedEmail;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ email }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500">Subject:</h3>
        <p className="text-gray-900">{email.subject}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500">Message:</h3>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-900">{email.body}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
