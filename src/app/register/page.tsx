'use client';

import React, { useState, useEffect } from 'react';
import RegisterForm from '@/libs/register';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telephone, setTelephone] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [passwordErrors, setPasswordErrors] = useState<{ message: string; isValid: boolean }[]>([
        { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร', isValid: false },
        { message: 'รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว', isValid: false },
        { message: 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว', isValid: false },
        { message: 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว', isValid: false },
    ]);
    const [telephoneError, setTelephoneError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

    useEffect(() => {
        const errors = [...passwordErrors];
        errors[0].isValid = password.length >= 8;
        errors[1].isValid = /[a-z]/.test(password);
        errors[2].isValid = /[A-Z]/.test(password);
        errors[3].isValid = /[0-9]/.test(password);
        setPasswordErrors(errors);

        if (telephone.length > 0 && (!/^\d+$/.test(telephone) || telephone.length !== 10)) {
            setTelephoneError('หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 ตัวเท่านั้น');
        } else {
            setTelephoneError(null);
        }

        if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('รูปแบบอีเมลไม่ถูกต้อง');
        } else {
            setEmailError(null);
        }
    }, [password, telephone, email]);

    const handleRegister = async () => {
        const hasPasswordErrors = passwordErrors.some((error) => !error.isValid);
        if (hasPasswordErrors || telephoneError || emailError) {
            setMessage('โปรดแก้ไขข้อผิดพลาดของรหัสผ่าน, หมายเลขโทรศัพท์ และอีเมลก่อนทำการสมัคร');
            return;
        }
        try {
            const result = await RegisterForm(name, telephone, email, password);
            setMessage("สมัครสมาชิกสำเร็จ!");
            console.log("สมัครสมาชิกสำเร็จ:", result);
        } catch (error) {
            setMessage(`สมัครสมาิกล้มเหลว: ${(error as Error).message}`);
            console.error("ข้อผิดพลาดในการสมัครสมาชิก:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">สมัครสมาชิก</h2>
                {message && (
                    <p
                        className={`text-sm text-center mb-4 ${
                            message.startsWith('สมัครสมาิกล้มเหลว') ? 'text-red-500' : 'text-green-500'
                        }`}
                    >
                        {message}
                    </p>
                )}
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">ชื่อเต็ม</label>
                        <input
                            type="text"
                            placeholder="กรุณากรอกชื่อเต็มของคุณ"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">อีเมล</label>
                        <input
                            type="email"
                            placeholder="กรุณากรอกอีเมลของคุณ"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {emailError && (
                            <p className="mt-2 text-red-500 text-sm">{emailError}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">รหัสผ่าน</label>
                        <input
                            type="password"
                            placeholder="กรุณากรอกรหัสผ่านของคุณ"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="mt-2 text-sm">
                            {passwordErrors.map((error, index) => (
                                <p key={index} className={error.isValid ? 'text-green-500' : 'text-red-500'}>
                                    {error.message}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">เบอร์โทรศัพท์</label>
                        <input
                            type="tel"
                            placeholder="กรุณากรอกเบอร์โทรศัพท์ของคุณ"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {telephoneError && (
                            <p className="mt-2 text-red-500 text-sm">{telephoneError}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="relative inline-block w-full h-12 text-[17px] font-medium border-2 border-black bg-gray-800 text-white rounded-md overflow-hidden transition-colors duration-500 hover:bg-white hover:text-black"
                    >
                        <span className="absolute top-full left-full w-[200px] h-[150px] bg-white rounded-full transition-all duration-700 hover:top-[-30px] hover:left-[-30px]"></span>
                        <span className="relative z-10">สมัครสมาชิก</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;