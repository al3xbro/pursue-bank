import React from 'react';

interface AccountIconProps {
  onClick: () => void; // Prop for handling click events
}

export default function AccountIcon({ onClick }: AccountIconProps) {
  return (
    <div
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110"
    >
      {/* You can replace the SVG with an image or other icons */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-white" // Keep the icon white for contrast
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" />
      </svg>
    </div>
  );
}
