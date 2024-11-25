async function login(email: string, password: string) {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/internal/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();

  if (response.ok) return data.accessToken;
  throw new Error('Login failed, please try again');
}

export { login };