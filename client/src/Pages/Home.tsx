import React, { useState } from 'react';

export default function Home() {

  const [balance, setBalance] = useState<number | undefined>(undefined);

  const fetchBalance = async () => {
    const res = await fetch('http://localhost:3000/api/internal/user/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const json = await res.json();
    setBalance(json.balance);
  }
  fetchBalance();

  //Frameworks for buttons
  function handleTransactions() {

  }

  function handlePayment() {

  }

  function handleWithDepo() {

  }

  function handleTransfer() {

  }

  return (
    <div className="flex flex-col items-center h-[calc(100vh-88px)] justify-center bg-gray-100 gap-5">


      <div className="flex flex-col gap-10 w-1/2 h-[calc(100vh-88px)] p-8 bg-indigo-600 rounded-lg shadow-lg">
        <div className="flex w-full h-full">

           {/* Left Column (3/5 width) */}
          <div className="flex-3 bg-white text-black p-8 rounded-lg shadow-lg mr-6">
            {/* Link to backend to display correct balance*/}
            <h1 className="text-6xl font-bold">{balance?.toLocaleString() ?? 'unable to fetch'}</h1>
            <h1 className="text-2xl">Current Balance</h1>

            <button
              onClick={handleTransactions}
              className="text-3xl font-semibold w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition"
            >
              My Transactions
            </button>
          </div>
          
          {/* Right Column (2/5 width) */}
          <div className="flex-2 bg-white text-black p-8 rounded-lg shadow-lg">
            <button
              onClick={handlePayment}
              className="text-3xl font-semibold w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition"
            >
              Make a payment
            </button>

            <button
              onClick={handleWithDepo}
              className="text-3xl font-semibold w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition"
            >
              Withdraw/Deposit
            </button>

            <button
              onClick={handleTransfer}
              className="text-3xl font-semibold w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition"
            >
              Transfer
            </button>
          </div>

          

        </div>
      </div>
    </div>

  );

}
