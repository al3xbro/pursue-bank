import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  // Function declaration for login handler
  function handleLogin() {
    console.log('Login clicked');
    // Assuming login validation logic here
    // After successful login, navigate to home page
    navigate('/');
  }

  // Function declaration for signup handler
  function handleSignup() {
    console.log('Signup clicked');
    // You could also navigate to a signup page if needed
  }

  return (
    <div className="flex flex-col justify-start items-center h-screen bg-gray-100 pt-16">
      {/* Bank Name Section */}
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-indigo-600">Pursue Bank</h1>
      </div>

      {/* Login Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter your password"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-600 transition"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="w-full mt-4 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
