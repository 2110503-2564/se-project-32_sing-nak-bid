'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for page navigation
import registerUser from "@/libs/userRegister";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [telnumber, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  // Use useEffect to ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegister = async () => {
    const response = await registerUser(name, telnumber, email, password);

    if (response.success) {
      alert("Registered Successfully");

      // Ensure router.push only runs after client-side rendering
      if (isClient) {
        router.push("/"); // Navigate to your desired page
      }
    } else {
      alert("Registration failed");
    }
  };

  if (!isClient) {
    return null; // Avoid rendering before client-side mount
  }

  return (     
    
    <div className="flex items-center justify-center min-h-screen bg-slate-100 bg-gray-200 bg-cover bg-center"  style={{backgroundImage : "url('/img/bg1.jpg')"}}>       
      <div className="p-10 my-10 items-center justify-center bg-white rounded-lg shadow-lg w-full sm:w-[400px]  border-4 border-red-900">         
        <div className="text-3xl text-red-900 mb-4 text-center font-bold">Create User</div>          

        {/* Name Field */}         
        <div className="flex items-center my-2">           
          <label className="w-auto block text-gray-700 pr-4" htmlFor="name">Name</label>           
          <input             
            type="text"             
            id="name"             
            name="name"             
            defaultValue="admin1"             
            placeholder="Name"             
            required             
            className="bg-white border-2 border-gray-200 rounded w-full p-2 text-gray-700 focus:outline-none focus:border-blue-400"             
            value={name}             
            onChange={(e) => {               
              setName(e.target.value);             
            }}           
          />         
        </div>          

        {/* Telephone Field */}         
        <div className="flex items-center my-4">           
          <label className="w-auto block text-gray-700 pr-4" htmlFor="tel">Telephone</label>           
          <input             
            type="text"             
            id="tel"             
            name="tel"             
            defaultValue="02-12345678"             
            placeholder="Telephone"             
            required             
            className="bg-white border-2 border-gray-200 rounded w-full p-2 text-gray-700 focus:outline-none focus:border-blue-400"             
            value={telnumber}             
            onChange={(e) => {               
              setTel(e.target.value);             
            }}           
          />         
        </div>          

        {/* Email Field */}         
        <div className="flex items-center my-4">           
          <label className="w-auto block text-gray-700 pr-4" htmlFor="email">Email</label>           
          <input             
            type="email"             
            id="email"             
            name="email"             
            defaultValue="admin1@gmail.com"             
            placeholder="Email"             
            required             
            className="bg-white border-2 border-gray-200 rounded w-full p-2 text-gray-700 focus:outline-none focus:border-blue-400"             
            value={email}             
            onChange={(e) => {               
              setEmail(e.target.value);             
            }}           
          />         
        </div>          

        {/* Password Field */}         
        <div className="flex items-center my-4">           
          <label className="w-auto block text-gray-700 pr-4" htmlFor="password">Password</label>           
          <input             
            type="password"             
            id="password"             
            name="password"             
            defaultValue="1111111"             
            placeholder="Password"             
            required             
            className="bg-white border-2 border-gray-200 rounded w-full p-2 text-gray-700 focus:outline-none focus:border-blue-400"             
            value={password}             
            onChange={(e) => {               
              setPassword(e.target.value);             
            }}           
          />         
        </div>          

        {/* Submit Button */}         
        <button           
          className="w-full bg-yellow-700 hover:bg-green-700 text-white p-2 rounded mt-4"           
          onClick={handleRegister}        
        >           
          Create User         
        </button>    
      </div>     
    </div>  
    
  ); 
}
