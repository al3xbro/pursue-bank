async function createTransaction(toEmail: string, amt: string) {
  const res = await fetch('http://localhost:3000/api/internal/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      transactionType: 'TRANSFER_INTERNAL',
      transforEmail: toEmail,
      amount: Number(amt),
    }),
  });
  if (!res.ok) {
    throw new Error('Error processing transaction');
  }
  const json = await res.json();
  return json;
}

async function getBalance() {
  const res = await fetch('http://localhost:3000/api/internal/transaction/balance', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}

async function getTransactions() {
  const res = await fetch('http://localhost:3000/api/internal/transaction', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}

async function getFirstName() {
  const res = await fetch('http://localhost:3000/api/internal/user/firstname', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}

async function getLastName() {
  const res = await fetch('http://localhost:3000/api/internal/user/lastname', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}

async function getEmail() {
  const res = await fetch('http://localhost:3000/api/internal/user/email', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}

export { createTransaction, getBalance, getTransactions, getFirstName, getLastName, getEmail };