import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import TopBar from './Components/TopBar'

function App() {
  return (
    <Router>
      {/*TopBar to be displayed on every page*/}
      <TopBar />


      {/*Need to define routes*/}
      <Routes>
        <Route path="/" element={<Home />} />         {/* Home Page */}
        <Route path="/login" element={<Login />} />   {/* Login Page */}
      </Routes>
    </Router>
  );
}

export default App
