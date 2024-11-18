import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [DOB, setDOB] = useState('');

    const [error, setError] = useState(''); // For displaying error messages
    const navigate = useNavigate(); // Initialize navigate

    // Function declaration for login handler
    async function handleSignup() {
        if (!email || !password || !firstName || !lastName || !address || !phone || !DOB) {
            setError("All fields are required.");
            return;
        }
        // Prepare login payload
        const signupData = { email, password, firstName, lastName, address, phone, DOB };

        try {
            // Send POST request to your login endpoint (replace 'https://your-api/login' with your actual API)
            const response = await fetch('http://localhost:3000/api/internal/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                // Handle login error (e.g., incorrect password)
                setError(data.message || 'Signup failed, please try again');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong, please try again later.');
        }
    }

    async function handleReturn() {
        navigate('/login');
    }

    return (
        <div className="flex flex-col items-center min-h-[calc(100vh-88px)] justify-center bg-gray-100">
            <div className="mb-8">
                <h1 className="text-6xl font-bold text-indigo-600">Pursue Bank</h1>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-bold text-center mb-4">Sign up</h2>

                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

                <div className="mb-4">
                    {/* <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label> */}
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="Enter your email"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                        title="Valid Email Address"
                    />
                </div>

                <div className="mb-4">
                    {/* <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label> */}
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="Password"
                    />
                </div>

                <div className="mb-4">
                    {/* <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label> */}
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirst(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="First Name"
                    />
                </div>

                <div className="mb-4">
                    {/* <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label> */}
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLast(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="Last Name"
                    />
                </div>
                
                <div className="mb-4">
                    {/* <label htmlFor="address" className="block text-sm font-semibold text-gray-700">Address</label> */}
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="Address"
                    />
                </div>

                <div className="mb-4">
                    {/* <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label> */}
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                        placeholder="Enter your phone number"
                        pattern="^\d{10}$"
                        title="Valid phone number"
                    />
                </div>

                <div className="mb-4">
                    {/* <label htmlFor="DOB" className="block text-sm font-semibold text-gray-700">Date of Birth</label> */}
                    <input
                        id="DOB"
                        type="date"
                        value={DOB}
                        placeholder="Date of birth"
                        onChange={(e) => setDOB(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                </div>

                <button
                    onClick={handleSignup}
                    className="w-full mt-4 bg-indigo-600 text-gray-700 p-2 rounded-md  hover:bg-indigo-700 transition text-white"
                >
                    Signup
                </button>

                <button
                    onClick={handleReturn}
                    className="w-full mt-4 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
