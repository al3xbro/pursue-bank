async function getBalance() {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/transaction/balance`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
  });
  const data = await response.json();

  if (response.ok) return data.balance;
  throw new Error('Login failed, please try again');
}

async function deposit(amount: number) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify({
      amount: amount,
      transactionType: 'DEPOSIT',
    }),
  });
  const data = await response.json();

  if (response.ok) return data;
  throw new Error('Deposit failed, please try again');
}

async function withdraw(amount: number) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify({
      amount: amount,
      transactionType: 'WITHDRAW',
    }),
  });
  const data = await response.json();

  if (response.ok) return data;
  throw new Error('Withdrawal failed, please try again');
}

export { getBalance, deposit, withdraw };