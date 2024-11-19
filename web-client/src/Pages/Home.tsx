import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import LargeButton from '../atoms/LargeButton';
import { createTransaction, getBalance, getTransactions, getUser } from '../services/transaction';
import TransactionBar from '../molecules/TransactionBar';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    getBalance().then((res) => setBalance(res.balance));
    getTransactions().then((res) => setTransactions(res));
    getUser()
        .then((res) => {
            console.log('Fetched User Data:', res); 

            const fetchedUser = res ?? {}; 

            setFirstName(fetchedUser.first_name ?? 'Unavailable');
          })
          .catch((err) => {
              console.error('Error fetching user:', err);
          });
  }, []);

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-88px)] justify-center bg-gray-100 p-4 sm:p-4 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-indigo-600">Welcome {firstName}!</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-20 w-full sm:w-3/5 min-w-96 h-auto my-8 sm:my-8">
        <div className="flex flex-col w-full max-h-fit sm:w-[60%] gap-6 sm:gap-8 rounded-lg">
          <div className="flex flex-col justify-between h-[200px] bg-white w-full rounded-lg p-4 sm:p-8">
            <div className="font-semibold text-lg sm:text-xl">Balance</div>
            <div className="font-semibold text-2xl sm:text-[40pt]">${balance !== undefined ? balance.toFixed(2) : 'unable to fetch'}</div>
          </div>
          
          <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col items-center w-full sm:p-8">
              <div className="font-semibold text-3xl sm:text-3xl">Transfer Money</div>
            </div>
            <div className="flex w-full p-4 space-x-4">
              <LargeButton onClick={() => navigate('/transferInt')}>
                <div className="text-lg sm:text-xl">Internal</div>
              </LargeButton>
              <LargeButton onClick={() => navigate('/transferExt')}>
                <div className="text-lg sm:text-xl">External</div>
              </LargeButton>
            </div>
            <div className="flex flex-col items-center w-full p-4">
              <button onClick={() => navigate('/checkDepo')} className="bg-yellow-500 mx-auto w-full sm:w-1/2 text-center p-2 shadow-md rounded-md">
                <div className="text-lg sm:text-xl">Deposit Check</div>
              </button>
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
          
          
          
          <div className="flex items-center w-full p-2">
            <button onClick={() => navigate('/findATMs')} className="bg-white mx-auto w-full sm:w-1/2 text-center p-2 shadow-md rounded-md">
              <div className="text-lg sm:text-xl">Find ATMs</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
