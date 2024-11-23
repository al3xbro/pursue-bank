import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { externalTransaction, externalRecurring } from '../services/transaction';
import Popup from 'reactjs-popup';

export default function Transfer() {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [error, setError] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isRecurringTransaction, setRecurringTransaction] = useState(false);
  const [transactionName, setTransactionName] = useState('');
  const [recurringPeriod, setRecurringPeriod] = useState('');
  const [targetBank, setTargetBank] = useState('');

  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!amount || !bankAccount) {
      setError('Please fill in all fields');
      return;
    } 
    else if(!targetBank) {
      setError('Please select a bank');
      return;
    }
    else if(isRecurringTransaction) {
      if (!transactionName || !recurringPeriod) {
        setError('Please fill in all recurring fields');
        return;
      }

      if (Number(recurringPeriod) > 31) {
        setError('Please select a valid date');
        return;
      }
    }
    setIsPopupOpen(true);
    setError('');
    console.log('Transferring', amount, 'to', bankAccount);

  };

  const handleFinalConfirm = async () => {
    if(!isRecurringTransaction) {
      try {
          // Call the createTransaction function with the amount and bank account
          const response = await externalTransaction(bankAccount, amount, targetBank);
          setTransactionId(response.id); // Set the transaction ID from response
          setIsPopupOpen(false);
          setShowReceipt(true);
        } catch (error) {
          console.error('Transaction Error:', error);
          setError('Transaction failed. Please try again.');
          setIsPopupOpen(false);
        }
    }
    else{
      try {
        // Call the createTransaction function with the amount and bank account
        const response = await externalRecurring(bankAccount, amount, recurringPeriod, targetBank);
        setTransactionId(response.id); // Set the transaction ID from response
        setIsPopupOpen(false);
        setShowReceipt(true);
      } catch (error) {
        console.error('Transaction Error:', error);
        setError('Transaction failed. Please try again.');
        setIsPopupOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setAmount('');
    setBankAccount('');
    setError('');
    setTransactionName('');
    setRecurringPeriod('');
    navigate('/');
  };

  const reset = () => {
    setAmount('');
    setBankAccount('');
    setError('');
    setTransactionName('');
    setRecurringPeriod('');
    setIsPopupOpen(false);
    setShowReceipt(false);
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-88px)] bg-gray-100 p-4">
      <div className={`absolute inset-0 flex items-center justify-center transition ${isPopupOpen || showReceipt ? 'blur-sm' : ''}`}>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg border-2 border-indigo-500">
          <h1 className="text-3xl font-bold mb-6 text-center">Transfer Money</h1>

          {error && (
            <div className="mb-4 text-red-500 text-center">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-4">
            {/* <label htmlFor="amount" className="block text-lg font-medium text-gray-700 mb-2">
              Amount
            </label> */}
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Bank Account Input */}
          <div className="mb-4">
            {/* <label htmlFor="bank-account" className="block text-lg font-medium text-gray-700 mb-2">
              Transfer To:
            </label> */}
            <input
              type="number"
              id="accountID"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Target Account ID"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select className="border border-gray-300 p-2 mb-4 text-gray-700" value={targetBank} onChange={e => setTargetBank(e.target.value)}>
            <option value="" disabled>Select Bank</option>
            <option value="chase">Chase</option>
            <option value="bofa">Bank of America</option>
            <option value="wellsfargo">Wells Fargo</option>
            <option value="citi">Citi Bank</option>
            <option value="us">U.S. Bank</option>
            <option value="pnc">PNC Bank</option>

          </select>

          <div className='mb-4'>
            <label><input type="checkbox" checked={isRecurringTransaction} onChange={() => setRecurringTransaction(!isRecurringTransaction)} /> Recurring Transaction</label>
          </div>

          {isRecurringTransaction ?
            <div>
              <div className='mb-4'>
                <label htmlFor="recurring-transaction" className="block text-lg font-medium text-gray-700 mb-2">
                  Recurring Transaction Name:
                </label>
                <input
                  type="text"
                  id="transaction-name"
                  value={transactionName}
                  onChange={(e) => setTransactionName(e.target.value)}
                  placeholder="Enter Transaction Name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className='mb-4'>
                <label htmlFor="recurring-transaction-period" className="block text-lg font-medium text-gray-700 mb-2">
                  Recurring Transaction Date (Monthly):
                </label>
                <input
                  type="number"
                  id="transaction-period"
                  value={recurringPeriod}
                  onChange={(e) => setRecurringPeriod(e.target.value)}
                  placeholder="Enter Day of the Month to Recure"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            : null}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>

            {/* Confirm Button */}

            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Next
            </button>
          </div>
          {/* Popup Confirmation */}
          <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} modal>
            <div className="p-20 bg-white rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Confirm Transfer</h2>
              <p className="mb-4">Amount: ${amount}</p>
              <p className="mb-4">Transfer to: {bankAccount}</p>

              <div className="flex justify-around mt-6">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </Popup>

          <Popup open={showReceipt} onClose={() => setShowReceipt(false)} modal>
            <div className="p-20 bg-white rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Transfer Information</h2>
              <p className="mb-4">Amount: ${amount}</p>
              <p className="mb-4">Transfer to: {bankAccount}</p>
              <p className="mb-4">Transfer ID: {transactionId}</p>


              <div className="flex justify-around mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Return
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  New Transfer
                </button>
              </div>
            </div>
          </Popup>
        </div>
      </div>
    </div>
  );
}
