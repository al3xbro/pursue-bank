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
            className="flex justify-between bg-white w-full p-8 border-2 border-black cursor-pointer"
        >
          <div className='flex justify-between bg-white w-full p-8 border-2 border-black'>
            <div className='font-semibold text-lg'>{email}</div>
            <div className='font-semibold text-lg'>${accountID}</div>
          </div>
      </div>
    )
  }