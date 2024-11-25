interface LargeButtonProps {
  text: string,
  onClick: () => void
}

export default function LargeButton({ text, onClick }: LargeButtonProps) {
  return (
    <button className='bg-green-500 text-white p-2 rounded-md' onClick={onClick}>{text}</button>
  )
}