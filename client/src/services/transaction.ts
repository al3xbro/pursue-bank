async function createTransaction(fromId: number, toId: number) {
  return await fetch('http://localhost:3000/api/internal/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      transaction_type: 'TRANSFER_INTERNAL',
      transfer_id: toId,
      amount: 100,
      user: {
        connect: {
          id: fromId,
        }
      },
    }),
  });
}

export { createTransaction };