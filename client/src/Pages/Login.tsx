import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For displaying error messages
  const navigate = useNavigate(); // Initialize navigate

  // Function declaration for login handler
  async function handleLogin() {
    // Prepare login payload
    const loginData = { email, password };

    try {
      // Send POST request to your login endpoint (replace 'https://your-api/login' with your actual API)
      const response = await fetch('https://your-api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming the API returns the accessToken in the response
        const { accessToken } = data;
        console.log('Login successful, Access Token:', accessToken);
        
        // Store the accessToken in localStorage or sessionStorage (or any storage mechanism)
        localStorage.setItem('accessToken', accessToken);

        // Navigate to home page after successful login
        navigate('/');
      } else {
        // Handle login error (e.g., incorrect password)
        setError(data.message || 'Login failed, please try again');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong, please try again later.');
    }
  }

  // Function declaration for signup handler
  function handleSignup() {
    console.log('Signup clicked');
    // Navigate to signup page or handle signup logic
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

        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

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
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition"
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
