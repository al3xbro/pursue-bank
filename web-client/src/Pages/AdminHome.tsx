import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import LargeButton from '../atoms/LargeButton';
import { getTransactions, getBalance, getUser } from '../services/transaction';
import TransactionBar from '../molecules/TransactionBar';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-88px)] justify-center bg-gray-100 p-4 sm:p-4 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-indigo-600">Welcome Admin {firstName}!</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-20 w-full sm:w-3/5 min-w-96 h-auto my-8 sm:my-8">
        <div className="flex flex-col w-full max-h-fit sm:w-[100%] gap-6 sm:gap-8 rounded-lg">

          
          <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col items-center w-full sm:p-8">
              <div className="font-semibold text-3xl sm:text-3xl">Manage Accounts</div>
            </div>
            <div className="flex w-full p-4 space-x-4">
              <div className="font-semibold text-sm sm:text-[40pt]">
                  {transactions
                    .slice() // Create a copy of the array to avoid mutating the original
                    .reverse() // Reverse the order of the array
                    /* .map((accounts) => (
                      //Implement AccountBar
                  )) ?? 'unable to fetch' */ } 
              </div>
            </div> 
          </div>
          
        </div>

        

      </div>
    </div>
  );
}
