export default function Node() {
  return (
    <div className='flex flex-col justify-between h-[200px] bg-gray-100 w-full rounded-lg p-8 shadow-md'>
      <div className='font-semibold text-xl'>Balance</div>
      <div className='font-semibold text-[40pt]'>{balance ?? 'unable to fetch'}</div>
    </div>
  )
}