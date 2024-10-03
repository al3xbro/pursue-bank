import React, { useState } from 'react';

export default function Home(){

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
        <div className="flex flex-col justify-start items-center h-screen bg-gray-100 pt-16">
            
            {/* Link to backend to display correct balance*/}
            <h1 className="text-6xl font-bold">$15,000</h1> 
            <h1 className="text-2xl">Current Balance</h1> 
            
            <div className="grid grid-cols-[3fr,2fr] gap-10 w-1/2 p-8 bg-indigo-600 rounded-lg shadow-lg">

            <button 
                onClick={handleTransactions}
                className="text-4xl font-semibold w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition"
            >
                My Transactions
            </button>

            <button 
                onClick={handlePayment} 
                className="text-4xl font-semibold w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition"
            >
                Make a payment
            </button>

            <button 
                onClick={handleWithDepo}
                className="text-4xl font-semibold w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition"
            >
                Withdraw/Deposit        
            </button>

            <button 
                onClick={handleTransfer}
                className="text-4xl font-semibold w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition"
            >
                Transfer
            </button>

                
            </div>
        </div>
        
    );

}
