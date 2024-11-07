import TransactionField from '../molecules/TransactionField';
import BalanceDisplay from '../atoms/BalanceDisplay';

export default function TransactionMenu() {

  return (
    <>
      <div className='flex flex-col gap-2 w-1/2 max-w-[500px]'>
        <BalanceDisplay />
        <TransactionField />
      </div>
    </>
  )
}