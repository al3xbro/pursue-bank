import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import TopBar from './Components/TopBar'
import Signup from './Pages/Signup';
import Transactions from './Pages/Transactions';
import FindATMs from './Pages/FindATMs';
import TransferInt from './Pages/TransferInt';
import TransferExt from './Pages/TransferExt';
import Account from './Pages/Account';
import CheckDepo from './Pages/CheckDepo';
import AdminHome from './Pages/AdminHome';
import AdminLogin from './Pages/AdminLogin';

function App() {
  return (
    <Router>
      {/*TopBar to be displayed on every page*/}
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/findATMs' element={<FindATMs />} />
        <Route path='/account' element={<Account />} />
        <Route path='/transferInt' element={<TransferInt />} />
        <Route path='/transferExt' element={<TransferExt />} />
        <Route path='/deposit' element={<CheckDepo />} />
        <Route path='/adminHome' element={<AdminHome/>} />
        <Route path='/adminLogin' element={<AdminLogin/>} />

      </Routes>
    </Router>
  );
}

export default App
