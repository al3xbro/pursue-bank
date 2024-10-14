import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AccountIcon from './AccountIcon';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function TopBar() {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Initialize navigate

  const handleAccountClick = () => {
    console.log('Account icon clicked'); // Need to implement when icon is clicked
  };

  // Determine if the current path is the login page
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="bg-indigo-600 text-white p-6 flex items-center shadow-md">
      <h1 className="text-xl font-bold">PB</h1>
      <nav className="ml-auto">
        <ul className="flex gap-4">
          <li className='m-auto'>
            <a href="/" className="hover:text-indigo-300" onClick={() => navigate('/')}>Home</a>
          </li>
          <li className='m-auto'>
            <a href="/about" className="hover:text-indigo-300" onClick={() => navigate('/about')}>About</a>
          </li>
          {!isLoginPage && <AccountIcon onClick={handleAccountClick} />}
        </ul>
      </nav>
      {/* Account Icon hidden on login page */}
    </div>
  );
}
