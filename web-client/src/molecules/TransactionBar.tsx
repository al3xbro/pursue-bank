
interface TransactionBarProps {
  amount: number;
  transactionType: string;
}

export default function TransactionBar({ amount, transactionType }: TransactionBarProps) {
  return (
    <div className='flex flex-col justify-between bg-gray-200 w-full rounded-lg p-8 shadow-md'>
      <div className='font-semibold text-lg'>{transactionType}</div>
      <div className='font-semibold text-lg'>{amount}</div>
    </div>
  )
}