import { useState } from 'react';

interface AccountBarProps {
    accountID: number;
    email: string;
    onClick: () => void;
}

export default function TransactionBar({ accountID, email, onClick }: AccountBarProps) {
    return (
        <div 
            onClick={onClick} 
        >
            <div className="flex justify-between bg-white w-full p-8 border-2 border-black hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
            <div className='font-semibold text-lg'>{email}</div>
            <div className='font-semibold text-lg'>Account ID: {accountID}</div>
          </div>
      </div>
    )
  }