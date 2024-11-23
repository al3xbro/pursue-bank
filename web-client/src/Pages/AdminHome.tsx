import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import LargeButton from '../atoms/LargeButton';
import { createTransaction, getBalance, getTransactions, getUser } from '../services/transaction';
import TransactionBar from '../molecules/TransactionBar';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-88px)] justify-center bg-gray-100 p-4 sm:p-4 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-indigo-600">Welcome Admin {firstName}!</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-20 w-full sm:w-3/5 min-w-96 h-auto my-8 sm:my-8">
        <div className="flex flex-col w-full max-h-fit sm:w-[60%] gap-6 sm:gap-8 rounded-lg">


          <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col items-center w-full sm:p-8">
              <div className="font-semibold text-3xl sm:text-3xl">Manage Accounts</div>
            </div>
            <div className="flex w-full p-4 space-x-4">
              <div className="font-semibold text-sm sm:text-[40pt]">
                {transactions.map((transaction) => (
                  <TransactionBar key={transaction.id} amount={transaction.amount} transactionType={transaction.transactionType} />
                )) ?? 'unable to fetch'}
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col w-full max-h-fit sm:w-[40%] gap-6 sm:gap-8">
          <div className="flex flex-col justify-between w-full bg-white shadow-md rounded-lg p-4 sm:p-8">
            <div className="font-semibold text-lg sm:text-xl">Recent Transactions:</div>
            <div className="font-semibold text-sm sm:text-[40pt]">
              {transactions.map((transaction) => (
                <TransactionBar key={transaction.id} amount={transaction.amount} transactionType={transaction.transactionType} />
              )) ?? 'unable to fetch'}
            </div>
            <button
              onClick={() => navigate('/transactions')}
              className="w-1/4 mt-4 bg-gray-200 text-gray-700 p-2 ml-auto rounded-md hover:bg-gray-300 transition"
            >
              See more
            </button>
          </div>
        </div>



      </div>
    </div>
  );
}
