import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import LargeButton from '../atoms/LargeButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deposit, withdraw } from '../services/transactions';

export default function TransactionField() {

  const { register, handleSubmit, formState: { errors } } = useForm()

  const queryClient = useQueryClient()
  const { mutate: makeDeposit } = useMutation({
    mutationKey: ['balance'],
    mutationFn: async (data: FieldValues) => {
      return deposit(data.amount)
    },
    onSuccess: () => queryClient.invalidateQueries()
  })
  const { mutate: makeWithdrawal } = useMutation({
    mutationKey: ['balance'],
    mutationFn: async (data: FieldValues) => {
      return withdraw(data.amount)
    },
    onSuccess: () => queryClient.invalidateQueries()
  })

  return (
    <>
      <form className='flex justify-between'>
        <input
          type='number'
          className='p-2 border border-gray-300 rounded-md'
          placeholder='Enter amount'
          {...register('amount', {
            required: {
              value: true,
              message: 'Please enter an amount.'
            }, pattern: {
              value: /^\d+(\.\d+)?$/,
              message: 'Please enter a positive amount.'
            }
          })}
        />
        <div className='flex gap-5'>
          <LargeButton text='Deposit' onClick={handleSubmit(makeDeposit as SubmitHandler<FieldValues>)} />
          <LargeButton text='Withdraw' onClick={handleSubmit(makeWithdrawal as SubmitHandler<FieldValues>)} />
        </div>
      </form>
      <div className='text-red-600'>{errors.amount?.message?.toString()}</div>
    </>
  )
}