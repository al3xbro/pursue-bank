import { useNavigate } from 'react-router-dom';
import NavBar from '../organisms/NavBar';
import { useEffect } from 'react';
import TransactionMenu from '../organisms/TransactionMenu';

export default function TransactionPage() {

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <>
      <NavBar />
      <div className='flex flex-col w-full h-[calc(100%-48px)] justify-center items-center'>
        <TransactionMenu />
      </div>
    </>
  )
}