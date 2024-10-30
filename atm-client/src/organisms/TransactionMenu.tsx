import BalanceDisplay from '../atoms/BalanceDisplay';
import LargeButton from '../atoms/LargeButton';
import { deposit, withdraw } from '../services/transactions';

export default function TransactionMenu() {
  return (
    <>
      <div className='flex flex-col gap-5'>
        <BalanceDisplay />
        <LargeButton text='Deposit' onClick={() => deposit(10)} />
        <LargeButton text='Withdraw' onClick={() => withdraw(10)} />
      </div>
    </>
  )
}