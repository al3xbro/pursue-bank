import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getFirstName, getLastName, getEmail } from '../services/transaction';


export default function Account() {
    const navigate = useNavigate(); // Initialize navigate
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        getFirstName().then((res) => setFirstName(res.firstName ?? 'Unavailable'))
        getLastName().then((res) => setLastName(res.lastName ?? 'Unavailable'))
        getEmail().then((res) => setEmail(res.email ?? 'Unavailable'))
      }, [])

    const handleLogOut = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };
    return (
        <div className="flex flex-col items-center h-[calc(100vh-88px)] justify-center bg-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mt-8 text-black">Account Information</h2>
            </div>
            <div className="flex flex-col items-left h-full w-1/2 bg-gray-100">
                <div className='font-semibold text-xl'>First Name: {firstName}</div>
                <br></br>
                <div className='font-semibold text-xl'>Last Name: {lastName}</div>
                <br></br>
                <div className='font-semibold text-xl'>Email: {email}</div>
                <br></br>
                <div className="flex justify-center mt-4">
                    <button onClick={handleLogOut} className="px-4 py-2 shadow bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Log Out
                    </button>
                </div>
            </div>

        </div>
    )
}