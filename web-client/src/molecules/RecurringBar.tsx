import { useState } from 'react';

interface RecurringBarProps {
    amount: number;
    transactionType: string;
    dayOfMonth: number;
    destination: string;
    onDelete: () => void;
}

export default function RecurringBar({ amount, transactionType, dayOfMonth, destination, onDelete }: RecurringBarProps) {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className="flex justify-between bg-white w-full p-8 sm:p-2 border-2 border-black">
          <div className="font-semibold text-lg">
            {transactionType === 'TRANSFER_INTERNAL'
              ? 'Internal Transfer'
              : 'External Transfer'}
          </div>
          <div className="font-semibold text-lg">{dayOfMonth} of month</div>
          <div className="font-semibold text-lg">${amount}</div>
          {/* Wrap the button and menu in a relative container */}
          <div className="relative flex ml-auto">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-black text-3xl w-8 h-8 flex items-center justify-center"
            >
              &#x22EE; {/* Vertical three dots */}
            </button>
            {showMenu && (
              <div className="absolute top-full right-0 bg-white shadow-lg rounded p-1 z-10 w-24 text-sm">
                <button
                  onClick={onDelete}
                  className="text-red-500 hover:bg-red-100 block px-2 py-1 w-full text-left rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      );
}