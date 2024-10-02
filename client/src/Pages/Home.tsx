import React, { useState } from 'react';

export default function Home() {
  const [balance, setBalance] = useState(15000.00);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {/* Balance Section */}
      <div className="text-center mb-10 -mt-8">
        <h1 className="text-6xl font-bold text-black">
          ${balance.toFixed(2)}
        </h1>
        <h2 className="text-xl text-black">Current Balance</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[3fr,2fr] gap-10 w-1/2 p-8 bg-indigo-600 rounded-lg shadow-lg h-[36rem]">
        
        {/* Transactions */}
        <div className="bg-white text-black p-16 rounded-lg shadow-lg flex justify-center items-center">
          <h2 className="text-3xl font-bold">My Transactions</h2>
        </div>

        {/* Payments */}
        <div className="bg-white text-black p-16 rounded-lg shadow-lg flex justify-center items-center">
          <h2 className="text-2xl font-bold">Make a Payment</h2>
        </div>

        {/* Withdraw/Deposit */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg flex justify-center items-center">
          <h2 className="text-3xl font-bold">Withdraw/Deposit</h2>
        </div>

        {/* Transfer */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg flex justify-center items-center">
          <h2 className="text-2xl font-bold">Transfer Money</h2>
        </div>
      </div>
    </div>
  );
}
