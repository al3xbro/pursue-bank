import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import LargeButton from '../atoms/LargeButton';
import { createTransaction, getBalance, getTransactions } from '../services/transaction';
import TransactionBar from '../molecules/TransactionBar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Home() {

  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [transactions, setTransactions] = useState<any[]>([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    getBalance().then((res) => setBalance(res.balance))
    getTransactions().then((res) => setTransactions(res))
  }, [])

  console.log(transactions)

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 ">
      <div className="flex gap-20 w-3/5 min-w-96 h-[calc(100vh-88px)] my-32">
        <div className='flex w-[60%] max-h-fit flex-col gap-8 bg-indigo-600 p-8 rounded-lg'>
          <div className='flex flex-col justify-between h-[200px] bg-gray-100 w-full rounded-lg p-8 shadow-md'>
            <div className='font-semibold text-xl'>Balance</div>
            <div className='font-semibold text-[40pt]'>{balance ?? 'unable to fetch'}</div>
          </div>
          <div className='flex flex-col justify-between bg-gray-100 w-full rounded-lg p-8 shadow-md'>
            <div className='font-semibold text-xl'>Recent Transactions:</div>
            <div className='font-semibold text-[40pt]'>{transactions.map((transaction) => <TransactionBar amount={transaction.amount} transactionType={transaction.transactionType} />) ?? 'unable to fetch'}</div>
            <button
              onClick={() => navigate('/transactions')}
                    className="w-1/4 mt-4 bg-gray-200 text-gray-700 p-2 ml-auto rounded-md hover:bg-gray-300 transition"
            >
                See more
            </button>
          </div>
        </div>
        <div className='flex flex-col w-[40%] gap-8'>
          <div className='font-semibold text-xl'>Transfer Money</div>
          <LargeButton onClick={() => createTransaction(2)}>
            <div className='text-xl'>
              Internal
            </div>
          </LargeButton>
          <LargeButton onClick={() => navigate('/transfer')}>
            <div className='text-xl'>
              External
            </div>
          </LargeButton>
          <button
            onClick={() => navigate('/findATMs')}
          >
            <div className='text-xl bg-yellow-500 mx-auto w-1/2 '>
              Find ATMs
            </div>
          </button>
        </div>
      </div>
    </div>

  );

}
