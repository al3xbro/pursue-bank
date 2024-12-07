import { isFuture, differenceInYears } from 'date-fns'

export function validateCash(prev: string, input: string) {
  if (input == '') return input
  const cashRegex = /^\d+(\.\d{0,2})?$/;
  return cashRegex.test(input) ? input : prev
}

export function isValidBirthDate(date: Date) {
  return !isFuture(date) && !(differenceInYears(new Date(), date) > 100)
}