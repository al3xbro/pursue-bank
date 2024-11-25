import { useState } from 'react'
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginMenu() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      localStorage.setItem('accessToken', await login(email, password))
      navigate('/atm');
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-80 border-2">
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
        onClick={() => handleLogin()}
        className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition"
      >
        Login
      </button>
    </div>
  )
}