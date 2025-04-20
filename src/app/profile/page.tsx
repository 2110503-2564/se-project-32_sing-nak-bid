import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>You are not Logged-In</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-gray-800">
        Profile
      </h1>
      <div className="max-w-sm w-full mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden"></div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">{session.user.name}</h2>
          <p className="text-sm text-gray-500">{session.user.email}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700">User Details:</h3>
          <ul className="space-y-2 mt-2">
            <li>
              <strong className="font-medium">Email:</strong>{" "}
              {session.user.email}
            </li>
            <li>
              <strong className="font-medium">Role:</strong> {session.user.role}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
