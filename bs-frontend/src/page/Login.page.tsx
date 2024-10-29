import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = 'admin@localhost'

interface FormData {
  email: string;
  password: string;
  // name?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate()

  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    // name: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (formData.email !== ADMIN_EMAIL && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    // if (isRightPanelActive && !formData.name) {
    //   newErrors.name = 'Name is required';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent, method: 'register' | 'login') => {
    event.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      const url = method === 'register' ? '/api/auth/register' : '/api/auth/login'
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
  
      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json()
          alert(data.message)
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.token); // เก็บ token ใน localStorage
      localStorage.setItem('username', formData.email);
      navigate('/')
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="flex flex-col items-center justify-center mx-auto h-screen font-sans">
        <a href="/" className="text-3xl font-bold text-green-800 flex items-center mb-2">Ani Meb</a>
        <div className="relative w-full max-w-screen-md min-h-[550px] bg-white rounded-lg overflow-hidden shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]">
          {/* Registration Form */}
          <div className={`absolute inset-0 transition-all duration-600 w-1/2 ${isRightPanelActive ? 'opacity-100 z-10 translate-x-full' : 'opacity-0 z-0'}`}>
            <form className="flex flex-col items-center justify-center h-full text-center px-12" onSubmit={(e) => handleSubmit(e, 'register')}>
              <h1 className="text-2xl font-light tracking-wide mb-8">สร้างบัญชีใหม่</h1>
              <div className="mb-4 pointer-events-none opacity-60" onClick={(e) => e.preventDefault()}>
                <GoogleLogin
                  onSuccess={(response) => {
                    console.log('Google Login Success:', response);
                    // เก็บข้อมูลผู้ใช้หรือตั้งค่า context ที่นี่
                  }}
                  onError={() => console.log('Google Login Failed')}
                  containerProps={{ className: "rounded-full overflow-hidden p-0" }}
                />
              </div>
              {/* <input
                className="bg-gray-200 p-3 my-2 w-full rounded-md"
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>} */}
              <input
                className="bg-gray-200 p-3 my-2 w-full rounded-md"
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
              <input
                className="bg-gray-200 p-3 my-2 w-full rounded-md"
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
              <button className="text-white bg-[#667848] font-bold uppercase px-12 py-3 my-4 rounded-full transition-transform hover:scale-105">
                สมัครสมาชิก
              </button>
            </form>
          </div>

          {/* Login Form */}
          <div className={`absolute inset-0 transition-all duration-600 w-1/2 ${isRightPanelActive ? 'opacity-0 z-0' : 'opacity-100 z-10'}`}>
            <form className="flex flex-col items-center justify-center h-full text-center px-12" onSubmit={(e) => handleSubmit(e, 'login')}>
              <h1 className="text-2xl font-light tracking-wide mb-8">เข้าสู่ระบบ</h1>
              <div className="mb-4 pointer-events-none opacity-60" onClick={(e) => e.preventDefault()}>
                <GoogleLogin
                  onSuccess={(response) => {
                    console.log('Google Login Success:', response);
                    // เก็บข้อมูลผู้ใช้หรือตั้งค่า context ที่นี่
                  }}
                  onError={() => console.log('Google Login Failed')}
                  containerProps={{ className: "rounded-full overflow-hidden p-0" }}
                />
              </div>
              <input
                className="bg-gray-200 p-3 my-2 w-full rounded-md"
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
              <input
                className="bg-gray-200 p-3 my-2 w-full rounded-md"
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
              <button className="text-white bg-[#667848] font-bold uppercase px-12 py-3 my-4 rounded-full transition-transform hover:scale-105">
                เข้าสู่ระบบ
              </button>
            </form>
          </div>

          {/* Switch Panel */}
          <div className={`absolute top-0 left-1/2 w-full h-full transition-transform duration-600 ${isRightPanelActive ? 'transform -translate-x-full' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#a27eb5] to-[#667848] text-white transform duration-600">
                <div className="absolute inset-y-0 right-0 w-1/2 flex flex-col items-center justify-center px-10 text-center transition-transform duration-600">
                <h1 className="text-2xl font-light mb-6">ยินดีตอนรับกลับนะเพื่อน</h1>
                <p className="mb-8">เข้าสู่ระบบเพื่อเชื่อมต่อกับเรา</p>
                <button
                  className="text-white bg-transparent border-2 border-white py-2 px-6 uppercase rounded-full hover:bg-white hover:text-black transition-colors"
                  onClick={() => setIsRightPanelActive(false)}
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            <div className="absolute inset-y-0 left-0 w-1/2 flex flex-col items-center justify-center px-10 text-center transition-transform duration-600">
                <h1 className="text-2xl font-light mb-6">สวัสดีเพื่อน</h1>
                <p className="mb-8">สมัครสมาชิกและเริ่มการเดินทางกับเรา</p>
                <button
                  className="text-white bg-transparent border-2 border-white py-2 px-6 uppercase rounded-full hover:bg-white hover:text-black transition-colors"
                  onClick={() => setIsRightPanelActive(true)}
                >
                  สร้างบัญชีใหม่
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;