import { useEffect, useState } from 'react';
import _ from 'lodash';
import LargeButton from '../atoms/LargeButton';
import { getBalance, getRecurring, getTransactions, deleteRecurring, getUser } from '../services/transaction';
import TransactionBar from '../molecules/TransactionBar';
import RecurringBar from '../molecules/RecurringBar';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [recurring, setRecurring] = useState<any[]>([]);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    console.log(localStorage.getItem('accessToken'));
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
  }, [navigate])

  useEffect(() => {
    getBalance().then((res) => setBalance(res.balance));
    getTransactions().then((res) => setTransactions(res));
    getRecurring().then((res) => setRecurring(res));
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

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  const handleDelete = (id: number) => {
    try {
      deleteRecurring(id);
    } catch (error) {
      console.error('Error:', error);
    }

    setRecurring((prev) => prev.filter((transaction) => transaction.id !== id));
  };

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
              <LargeButton onClick={() => navigate('/transfer-internal')}>
                <div className="text-lg sm:text-xl">Internal</div>
              </LargeButton>
              <LargeButton onClick={() => navigate('/transfer-external')}>
                <div className="text-lg sm:text-xl">External</div>
              </LargeButton>
            </div>
            <div className="flex flex-col items-center w-full p-4">
              <button onClick={() => navigate('/deposit')} className="bg-yellow-500 mx-auto w-full sm:w-1/2 text-center p-2 shadow-md rounded-md">
                <div className="text-lg sm:text-xl">Deposit Check</div>
              </button>
            </div>
          </div>

        </div>

        <div className="flex flex-col w-full max-h-fit sm:w-[40%] gap-6 overflow-y-auto sm:gap-8">
          <div className="flex flex-col max-h-[400px] overflow-y-auto justify-between w-full bg-white shadow-md rounded-lg p-4 sm:p-8">
            <div className="flex mb-4 border-b">
              <button
                className={`px-4 py-2 ${activeTab === 'transactions'
                  ? 'text-indigo-600 text-left border-b-2 border-indigo-600'
                  : 'text-gray-600 text-left'
                  }`}
                onClick={() => handleTabClick('transactions')}
              >
                Recent Transactions
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'recurring'
                  ? 'text-indigo-600 text-left border-b-2 border-indigo-600'
                  : 'text-gray-600 text-left'
                  }`}
                onClick={() => handleTabClick('recurring')}
              >
                Recurring Transactions
              </button>
            </div>
            {activeTab === 'transactions' &&
              <div className="font-semibold text-sm sm:text-[40pt]">
                {transactions
                  .slice() // Create a copy of the array to avoid mutating the original
                  .reverse() // Reverse the order of the array
                  .map((transaction) => (
                    <TransactionBar
                      key={transaction.id}
                      amount={transaction.amount}
                      transactionType={transaction.transaction_type}
                    />
                  )) ?? 'unable to fetch'}
              </div>
            }
            {activeTab === 'recurring' &&
              <div className="font-semibold text-sm sm:text-[40pt]">
                {recurring
                  .slice() // Create a copy of the array to avoid mutating the original
                  .reverse() // Reverse the order of the array
                  .map((recurring) => (
                    <RecurringBar
                      key={recurring.id}
                      amount={recurring.amount}
                      transactionType={recurring.transaction_type}
                      dayOfMonth={recurring.day_of_month}
                      destination={recurring.transfer_id}
                      onDelete={() => handleDelete(recurring.id)}
                    />
                  )) ?? 'unable to fetch'}
              </div>
            }

          </div>


          <div className="flex w-full gap-4">
            <button onClick={() => navigate('/find-atms')} className="bg-white mx-auto w-full sm:w-1/2 text-center p-2 shadow-md rounded-md">
              <div className="text-lg sm:text-xl">Find ATMs</div>
            </button>
          </div>
        </div>



      </div>
    </div>
  );
}
