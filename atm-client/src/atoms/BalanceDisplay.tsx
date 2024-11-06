import { useEffect, useState } from 'react';
import { getBalance } from '../services/transactions';

export default function BalanceDisplay() {

  const [balance, setBalance] = useState(undefined);

  useEffect(() => {
    const fetchBalance = async () => {
      setBalance(await getBalance())
    }
    fetchBalance()
  }, []);

  return (
    <div className='text-lg'>Balance: {balance ?? 'can\'t fetch'}</div>
  )
}