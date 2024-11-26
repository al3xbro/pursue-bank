
interface TransactionBarProps {
  amount: number;
  transactionType: string;
}

export default function TransactionBar({ amount, transactionType }: TransactionBarProps) {
  return (
    <div>
      { transactionType=="TRANSFER_INTERNAL" ? 
        <div className='flex justify-between bg-white w-full p-8 border-2 border-black'>
          <div className='font-semibold text-lg'>Internal Transfer</div>
          <div className='font-semibold text-lg'>${amount}</div>
        </div>
      : transactionType=="TRANSFER_EXTERNAL" ?
        <div className='flex justify-between bg-white w-full p-8 border-2 border-black'>
          <div className='font-semibold text-lg'>External Transfer</div>
          <div className='font-semibold text-lg'>${amount}</div>
        </div>
      : transactionType=="WITHDRAW" ?
        <div className='flex justify-between bg-white w-full p-8 border-2 border-black'>
          <div className='font-semibold text-lg'>Withdraw</div>
          <div className='font-semibold text-lg'>${amount}</div>
        </div>
      :
        <div className='flex justify-between bg-white w-full p-8 border-2 border-black'>
          <div className='font-semibold text-lg'>Deposit</div>
          <div className='font-semibold text-lg'>${amount}</div>
        </div>
      }
    </div>
  )
}