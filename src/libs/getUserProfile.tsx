export default async function getUserProfile(token:string) {
  const response = await fetch("https://ya-seleng-back-end.vercel.app/api/v1/auth/me",
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return await response.json();
}
