async function internalTransaction(toEmail: string, amt: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      transactionType: 'TRANSFER_INTERNAL',
      transferEmail: toEmail,
      amount: Number(amt),
    }),
  });
  if (!res.ok) {
    throw new Error('Error processing transaction');
  }
  const json = await res.json();
  return json;
}

async function depositTransaction(amt: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      transactionType: 'DEPOSIT',
      amount: Number(amt),
    }),
  });
  if (!res.ok) {
    throw new Error('Error processing transaction');
  }
  const json = await res.json();
  return json;
}

async function internalRecurring(toEmail: string, amt: string, day: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/autopay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      transactionType: 'TRANSFER_INTERNAL',
      transferEmail: toEmail,
      amount: Number(amt),
      dayOfMonth: Number(day),
    }),
  });
  if (!res.ok) {
    throw new Error('Error processing transaction');
  }
  const json = await res.json();
  return json;
}

async function externalTransaction(toEmail: string, amt: string, bank: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      transactionType: 'TRANSFER_EXTERNAL',
      transferEmail: toEmail,
      amount: Number(amt),
      destination: bank,
    }),
  });
  if (!res.ok) {
    throw new Error('Error processing transaction');
  }
  const json = await res.json();
  return json;
}

async function externalRecurring(toEmail: string, amt: string, day: string, bank: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/autopay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      transactionType: 'TRANSFER_EXTERNAL',
      transferEmail: toEmail,
      amount: Number(amt),
      dayOfMonth: Number(day),
      destination: bank,
    }),
  });
  if (!res.ok) {
    throw new Error('Error processing transaction');
  }
  const json = await res.json();
  return json;
}

async function getBalance() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/transaction/balance`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}

async function getTransactions() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/transaction`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}

async function getRecurring() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/autopay`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}

async function deleteRecurring(trans_id: number) {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/autopay`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      status: 'DISABLED',
      id: trans_id
    }),
  });
  const json = await res.json();
  return json
}

async function getUser() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const json = await res.json();
  return json
}


export { internalTransaction, internalRecurring, depositTransaction, externalTransaction, externalRecurring, getBalance, getTransactions, adminGetTransactions, getRecurring, deleteRecurring, getUser, getAdminUsers };