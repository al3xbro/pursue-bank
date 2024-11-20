import React, { useRef, useState } from 'react';
import WebcamComponent from '../Components/WebCamComponent';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../services/transaction';

export default function CheckDepo() {
  const [image, setImage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);

  // Ref for WebcamComponent
  const webcamRef = useRef<{ capture: () => void }>(null);

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

  const handlePhotoClick = () => {
    if (webcamRef.current) {
      webcamRef.current.capture(); // Call the capture function from WebcamComponent
      setIsPhotoTaken(true);
    }
  };

  const retakePhotoClick = () => {
    setIsPhotoTaken(false);
  }

  return (
      <div className="absolute inset-0 flex items-center justify-center transition">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg border-2 border-indigo-500">
          <h1 className="text-3xl font-bold mb-6 text-center">Check Deposit</h1>

          {/* Amount Input */}
          <div className="mb-4">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* WebcamComponent */}
          {!isPhotoTaken ? 
          <WebcamComponent ref={webcamRef} setShowCamera={setIsPopupOpen} setImageUrl={setImage} />
          : null}

          {/* Capture Photo Button */}
          {!isPhotoTaken ? 
          <div className={"flex justify-center mb-4 p-4"} >
            <button
              onClick={handlePhotoClick}
              className="px-2 py-2 bg-yellow-500 text-white rounded-md hover:bg-gray-500 transition"
            >
              Take Photo
            </button>
          </div>
          : null}

          
          {/* Display Captured Photo */}
          {isPhotoTaken ? 
          <div>
          {image && (
            <div className="mt-4">
              <img src={image} alt="Captured" className="w-full h-auto rounded-md" />
            </div>
          )}
          </div>
          : null}

          {isPhotoTaken ? 
          <div className={"flex justify-center mb-4 p-4"} >
            <button
              onClick={retakePhotoClick}
              className="px-2 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              Retake Photo
            </button>
          </div>
          : null }
          {/* Buttons */}
          <div className="flex justify-between">
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
  );
}
