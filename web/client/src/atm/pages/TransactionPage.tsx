import { useNavigate } from 'react-router-dom';
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
      <div className='flex flex-col w-full h-[calc(100%-48px)] justify-center items-center'>
        <TransactionMenu />
      </div>
    </>
  )
}