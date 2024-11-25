async function adminGetTransactions(id: number) {
  const res = await fetch(`${import.meta.env.VITE_ADMIN_SERVER_URL}/api/admin/transaction/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  });
  const json = await res.json();
  return json
}

async function getAdminUsers() {
  const res = await fetch(`${import.meta.env.VITE_ADMIN_SERVER_URL}/api/admin/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  });
  const json = await res.json();
  console.log(json)
  return json
}

async function getUser(id: number) {
  const res = await fetch(`${import.meta.env.VITE_ADMIN_SERVER_URL}/api/admin/user/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
    },
  });
  const json = await res.json();
  console.log(json)
  return json
}


export { adminGetTransactions, getAdminUsers, getUser };