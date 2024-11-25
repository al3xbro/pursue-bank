import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import TopBar from './Components/TopBar'
import Signup from './Pages/Signup';
import FindATMs from './Pages/FindATMs';
import TransferInt from './Pages/TransferInt';
import TransferExt from './Pages/TransferExt';
import Account from './Pages/Account';
import CheckDepo from './Pages/CheckDepo';
import TransactionPage from './atm/pages/TransactionPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/*TopBar to be displayed on every page*/}
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/find-atms' element={<FindATMs />} />
          <Route path='/account' element={<Account />} />
          <Route path='/atm' element={<TransactionPage />} />
          <Route path='/transfer-internal' element={<TransferInt />} />
          <Route path='/transfer-external' element={<TransferExt />} />
          <Route path='/deposit' element={<CheckDepo />} />
        </Routes>
      </Router>
    </QueryClientProvider>

  );
}

export default App
