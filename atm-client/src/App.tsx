import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TransactionPage from './pages/TransactionPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path='/atm' element={<TransactionPage />} />
            <Route path='/atm/login' element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
} 