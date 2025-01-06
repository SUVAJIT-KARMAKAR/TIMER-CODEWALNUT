import React from 'react';

export const EmptyState: React.FC = () => (
  <svg
    className="w-64 h-64 mb-4 text-gray-300"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 6V12L16 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 8.5C7 8.5 8.5 7 12 7C15.5 7 17 8.5 17 8.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);