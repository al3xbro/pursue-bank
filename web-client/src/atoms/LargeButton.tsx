import React from 'react';

interface LargeButtonProps {
  children: React.ReactNode;
  onClick: () => void; 
}

export default function LargeButton({ children, onClick }: LargeButtonProps) {
  return (
    <button className="flex-1 bg-white rounded-lg h-20 shadow-md" onClick={onClick}>
      {children}
    </button>
  )
}
