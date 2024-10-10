import React from 'react';

interface LargeButtonProps {
  children: React.ReactNode;
}

export default function LargeButton({ children }: LargeButtonProps) {
  return (
    <button className="bg-gray-300 rounded-lg h-20 shadow-md">
      {children}
    </button>
  )
}