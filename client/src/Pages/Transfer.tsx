import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Transfer() {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleConfirm = () => {
    if (!amount || !bankAccount) {
      setError('Please fill in both fields');
      return;
    }

    console.log('Transferring', amount, 'to', bankAccount);
  };

  const handleCancel = () => {
    setAmount('');
    setBankAccount('');
    setError('');
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg border-2 border-indigo-500">
        <h1 className="text-3xl font-bold mb-6 text-center">Transfer Money</h1>

        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Amount Input */}
        <div className="mb-4">
          <label htmlFor="amount" className="block text-lg font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Bank Account Input */}
        <div className="mb-4">
          <label htmlFor="bank-account" className="block text-lg font-medium text-gray-700 mb-2">
            Transfer To:
          </label>
          <input
            type="text"
            id="bank-account"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="Enter bank account"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

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
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
