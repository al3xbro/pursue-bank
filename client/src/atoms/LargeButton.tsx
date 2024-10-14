import React from 'react';

interface LargeButtonProps {
  children: React.ReactNode;
  onClick: () => void; 
}

export default function LargeButton({ children, onClick }: LargeButtonProps) {
  return (
    <button className="bg-gray-300 rounded-lg h-20 shadow-md" onClick={onClick}>
      {children}
    </button>
  )
}