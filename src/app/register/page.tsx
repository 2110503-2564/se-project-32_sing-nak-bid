'use client';

import React, { useState } from 'react';
import RegisterForm from '@/libs/register';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telephone, setTelephone] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleRegister = async () => {
        try {
            const result = await RegisterForm(name, telephone, email, password);
            setMessage("Registration successful!");
            console.log("Registration successful:", result);
        } catch (error) {
            setMessage(`Registration failed: ${(error as Error).message}`);
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                {message && (
                    <p
                        className={`text-sm text-center mb-4 ${
                            message.startsWith('Registration failed') ? 'text-red-500' : 'text-green-500'
                        }`}
                    >
                        {message}
                    </p>
                )}
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="relative inline-block w-full h-12 text-[17px] font-medium border-2 border-black bg-gray-800 text-white rounded-md overflow-hidden transition-colors duration-500 hover:bg-white hover:text-black"
                    >
                         <span className="absolute top-full left-full w-[200px] h-[150px] bg-white rounded-full transition-all duration-700 hover:top-[-30px] hover:left-[-30px]"></span>
                         <span className="relative z-10">Register</span>  
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
