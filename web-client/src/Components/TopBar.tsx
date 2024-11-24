import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountIcon from './AccountIcon';

export default function TopBar() {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Initialize navigate

  // Determine if the current path is the login page
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup' || 
      location.pathname === '/transferInt' || location.pathname === '/transferExt' || location.pathname === '/deposit'
        || location.pathname === '/adminHome' || location.pathname === '/adminLogin';

  return (
    <div className="bg-indigo-600 text-white p-6 flex shadow-md w-full">
      <h1 className="text-xl font-bold">PB</h1>
      <nav className="ml-auto">
        <ul className="flex gap-4">
        {!isLoginPage && (
          <li className="m-auto">
            <a href="/" className="hover:text-indigo-300" onClick={() => navigate('/')}>Home</a>
          </li>
        )}
          {!isLoginPage && <AccountIcon onClick={() => navigate('/account')
} />}
        </ul>
      </nav>
    </div>
  );
}
