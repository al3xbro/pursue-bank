import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For displaying error messages
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/');
    }
  }, [navigate])

  // Function declaration for login handler
  async function handleLogin() {
    // Prepare login payload
    const loginData = { email, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_ADMIN_SERVER_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      console.log(data)

      if (response.ok) {
        // Assuming the API returns the adminToken in the response
        const { adminToken, accountId } = data;
        console.log('Login successful, Access Token:', adminToken);

        // Store the adminToken in localStorage or sessionStorage (or any storage mechanism)
        localStorage.setItem('adminToken', adminToken);
        localStorage.setItem('accountId', accountId)

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


  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-88px)] justify-center bg-gray-100">
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-indigo-600">Pursue Bank</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <div className="text-center mb-6">
          <h2 className='text-2xl font-bold'>Welcome</h2>
          <h4 className="text-m text-indigo-600">Admin Login</h4>
        </div>

        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        <div className="mb-4">
          {/* <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label> */}
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Email"
          />
        </div>

        <div className="mb-6">
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

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}