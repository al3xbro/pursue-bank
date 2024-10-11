import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import TopBar from './Components/TopBar'
import Signup from './Pages/Signup';
import Transactions from './Pages/Transactions';
import FindATMs from './Pages/FindATMs';

function App() {
  return (
    <Router>
      {/*TopBar to be displayed on every page*/}
      <TopBar />


      {/*Need to define routes*/}
      <Routes>
        <Route path="/" element={<Home />} />         {/* Home Page */}
        <Route path="/login" element={<Login />} />   {/* Login Page */}
        <Route path='/signup' element={<Signup />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/findATMs' element={<FindATMs />} />
      </Routes>
    </Router>
  );
}

export default App
