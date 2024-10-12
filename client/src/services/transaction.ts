async function createTransaction(toId: number) {
  const res = await fetch('http://localhost:3000/api/internal/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      transactionType: 'TRANSFER_INTERNAL',
      transferId: toId,
      amount: 100,
    }),
  });
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

export { createTransaction, getBalance, getTransactions };