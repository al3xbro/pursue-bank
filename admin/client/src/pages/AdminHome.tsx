import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountBar from '../molecules/AccountBar';
import TransactionBar from '../molecules/TransactionBar';
import { adminGetTransactions, getAdminUsers, getUser } from '../services/transaction';

export default function Home() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountID, setAccountID] = useState<number>(-1);
  const [accountClicked, setAccountClicked] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDOB] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/login');
    }
  }, [navigate])

  const handleAccountClick = (id: number) => {
    setAccountID(id);
    setAccountClicked(true);
    adminGetTransactions(id).then((res) => {
      console.log("API Response:", res); // Check the response structure
      setTransactions(res);
    });
    getUser(id)
    .then((res) => {
      const fetchedUser = res ?? {};

      setFirstName(fetchedUser.first_name ?? 'Unavailable');
      setEmail(fetchedUser.email ?? 'Unavailable');
      setLastName(fetchedUser.last_name ?? 'Unavailable');
      setAddress(fetchedUser.address ?? 'Unavailable');
      setPhone(fetchedUser.phone ?? 'Unavailable');
      setDOB(fetchedUser.dob ?? 'Unavailable');
    })
    .catch((err) => {
      console.error('Error fetching user:', err);
    });
  };

  const handleBackClick = () => {
    setAccountClicked(false);
  };

  useEffect(() => {
    getAdminUsers().then((res) => setAccounts(res));
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-88px)] justify-center bg-gray-100 p-4 sm:p-4 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-indigo-600">Welcome Admin!</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-20 w-auto min-w-96 h-auto my-8 sm:my-8">
        <div className="flex flex-col w-full max-h-fit sm:w-[100%] gap-6 sm:gap-8 rounded-lg">


          {!accountClicked ?
            <div>
              <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex flex-col items-center w-full sm:p-8">
                  <div className="font-semibold text-3xl sm:text-3xl">Manage Accounts</div>
                </div>
                <div className="flex w-full justify-center p-4 space-x-4 overflow-y-auto max-h-[400px]">
                  <div className="font-semibold text-sm sm:text-[40pt]">
                    {accounts
                      .slice()
                      .reverse()
                      .map((account) => (
                        <AccountBar
                          key={account.id}
                          accountID={account.id}
                          email={account.email}
                          onClick={() => handleAccountClick(account.id)}
                        />
                      )) ?? 'unable to fetch'}
                  </div>
                </div>

              </div>
              <div className="flex justify-center mt-4">
                <button onClick={handleLogOut} className="px-4 py-2 shadow bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Log Out
                </button>
              </div>
            </div>
            :
            <div>
              <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
                <div className="flex flex-col items-left w-full sm:p-8">
                  <div className="font-semibold text-3xl sm:text-3xl">Account ID: {accountID}</div>
                  <div className="font-semibold text-3xl sm:text-3xl">Account Email: {email}</div>
                  <div className="font-semibold text-3xl sm:text-3xl">Account Name: {firstName} {lastName}</div>
                  <div className="font-semibold text-3xl sm:text-3xl">Account Address: {address}</div>
                  <div className="font-semibold text-3xl sm:text-3xl">Account Phone Number: {phone}</div>
                  <div className="font-semibold text-3xl sm:text-3xl">Account Date of Birth: {dob}</div>
                  <div className="font-semibold text-3xl sm:text-3xl">Transfer History:</div>
                </div>
                <div className="flex w-full justify-center p-4 space-x-4 overflow-y-auto max-h-[400px]">
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
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button onClick={handleBackClick} className="px-4 py-2 shadow bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Back
                </button>
              </div>
            </div>
          }



        </div>




      </div>
    </div>
  );
}
