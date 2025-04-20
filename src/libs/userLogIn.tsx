export default async function userLogin(
  userEmail: string,
  userPassword: string
) {
  const response = await fetch(
    "http://localhost:5000/api/v1/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    token: data.token,
    success: data.success,
  };
}
