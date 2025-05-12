import React from 'react';
import type { GeneratedEmail } from '@/types';

interface EmailTemplateProps {
  email: GeneratedEmail;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ email }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500">To:</h3>
        <p className="text-gray-900">{email.recipient || 'Organization Contact'}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500">Subject:</h3>
        <p className="text-gray-900">{email.subject}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">Body:</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-900 whitespace-pre-wrap">{email.body}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;
