import React, { useRef, useState } from 'react';
import WebcamComponent from "../Components/WebCamComponent";
import { useNavigate } from 'react-router-dom'; // Import useNavigate


export default function CheckDepo() {    
    const [image, setImage] = useState<string | ImageData>('');
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleCancel = () => {
        setAmount('');
        navigate('/');
      };

      const handleConfirm = () => {
        if (!amount) {
          setError('Please fill in the amount field');
          return;
        } 
          setError('');
          console.log('Depositing', amount);
      };

    return (
        <div>
            <div className={`absolute inset-0 flex items-center justify-center transition ${isPopupOpen ? 'blur-sm' : ''}`}>
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg border-2 border-indigo-500">

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

                <WebcamComponent setShowCamera={function (value: React.SetStateAction<boolean>): void {
                        throw new Error('Function not implemented.');
                    } } setImageUrl={function (value: React.SetStateAction<string | null>): void {
                        throw new Error('Function not implemented.');
                    } }>
                    
                </WebcamComponent>

                {/* Only render <img> if image is a string */}
                {typeof image === 'string' && image && (
                    <img src={image} alt='Taken photo' />
                )}
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
                </div>
            </div>
        </div>
    );
}
