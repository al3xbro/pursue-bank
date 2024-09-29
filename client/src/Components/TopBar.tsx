import React from 'react';
import { useLocation } from 'react-router-dom';
import AccountIcon from './AccountIcon';

export default function TopBar() {
  const location = useLocation(); // Get the current location

  const handleAccountClick = () => {
    console.log('Account icon clicked'); // Need to implement when icon is clicked
  };

  // Determine if the current path is the login page
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="bg-indigo-600 text-white p-6 flex items-center shadow-md">
      <h1 className="text-xl font-bold">Pursue Bank</h1>
      <nav className="ml-auto">
        <ul className="flex space-x-6">
          <li><a href="/" className="hover:text-indigo-300">Home</a></li>
          <li><a href="/about" className="hover:text-indigo-300">About</a></li>
        </ul>
      </nav>
      {/* Account Icon hidden on login page */}
      {!isLoginPage && <AccountIcon onClick={handleAccountClick} />}
    </div>
  );
}
