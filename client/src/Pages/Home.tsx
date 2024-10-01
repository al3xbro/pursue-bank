import React from 'react';

export default function Home(){
    return (
        <div className="flex flex-col justify-start items-center h-screen bg-gray-100 pt-16">
            
            <h1 className="text-6xl font-bold">$15,000 </h1> 
            <h1 className="text-2xl">Current Balance: </h1> 
            
            <div className="container m-auto grid grid-cols-2 gap-4 bg-indigo-600 p-20 rounded-lg shadow-lg w-100">

            <button className="w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition">
                My Transactions
            </button>

            <button className="w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition">
                Make a payment
            </button>

            <button className="w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition">
                Withdraw/Deposit        
            </button>

            <button className="w-50 mt-4 bg-gray-50 text-black p-20 rounded-md hover:bg-gray-100 transition">
                Transfer
            </button>

                
            </div>
        </div>
    );

}