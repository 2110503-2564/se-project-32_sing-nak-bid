"use server"
export default async function userRegister(
  userName: string,
  userTel: string,
  userEmail: string,
  userPassword: string
) {
  const response = await fetch(
    "https://pompengamer.vercel.app/api/v1/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        telnumber: userTel,
        email: userEmail,
        password: userPassword,
        role: "user", // ✅ Role is always "user"
      }),
    }
  );

  if (!response.ok) {
    console.log(userEmail)
    console.log(userName)
    console.log(userPassword)
    console.log(userTel)
    throw new Error("Registration failed. Please try again.");
  }

  return await response.json();
}
