import React from 'react';

export const TimerBackground: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full -z-10 opacity-5"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
    <path
      d="M50 20V50L70 70"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);