import { getBalance } from '../services/transactions';
import { useQuery } from '@tanstack/react-query';

export default function BalanceDisplay() {

  const { data, isError } = useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      return getBalance()
    },
  })

  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     setBalance(await getBalance())
  //   }
  //   fetchBalance()
  // }, []);

  return (
    <div className='text-lg'>Balance: {isError ? 'can\'t fetch' : data}</div>
  )
}