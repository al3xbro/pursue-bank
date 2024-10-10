import React, { useState } from 'react';
import _ from 'lodash';
import LargeButton from '../atoms/LargeButton';

export default function Home() {

  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchBalance = async () => {
    const res = await fetch('http://localhost:3000/api/internal/user/test', { // TODO: change to correct endpoint
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const json = await res.json();
    setBalance(json.balance);
  }

  const fetchTransactions = async () => {
    const res = await fetch('http://localhost:3000/api/internal/user/test', { // TODO: change to correct endpoint
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const json = await res.json();
    setTransactions(_.take(json.balance, 10));
  }

  fetchBalance();
  fetchTransactions();

  function handlePayment() {

  }

  function handleWithDepo() {

  }

  function handleTransfer() {

  }

  return (
    <div className="flex flex-col items-center h-[calc(100vh-88px)] justify-center bg-gray-100 gap-5">
      <div className="flex gap-20 w-3/5 min-w-96 h-[calc(100vh-88px)] my-32">
        <div className='flex w-[60%] max-h-fit flex-col gap-8 bg-indigo-600 p-8 rounded-lg'>
          <div className='flex flex-col justify-between h-[200px] bg-gray-100 w-full rounded-lg p-8 shadow-md'>
            <div className='font-semibold text-xl'>Balance</div>
            <div className='font-semibold text-[40pt]'>{balance ?? 'unable to fetch'}</div>
          </div>
          <div className='flex flex-col justify-between h-[200px] bg-gray-100 w-full rounded-lg p-8 shadow-md'>
            <div className='font-semibold text-xl'>Transactions</div>
            <div className='font-semibold text-[40pt]'>{transactions.map((transaction) => transaction.amount) ?? 'unable to fetch'}</div>
          </div>
        </div>
        <div className='flex flex-col w-[40%] gap-8'>
          <div className='font-semibold text-xl'>Transfer</div>
          <LargeButton>
            <div className='text-xl'>
              Internal
            </div>
          </LargeButton>
          <LargeButton>
            <div className='text-xl'>
              External
            </div>
          </LargeButton>
        </div>
      </div>
    </div>

  );

}
