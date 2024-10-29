import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const AniMebSignup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendUpdates, setSendUpdates] = useState(false);

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement signup logic here
    console.log('Signup with:', { email, username, password, sendUpdates });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-md">
        <h1 className='text-3xl font-bold text-center mb-8'>Ani Meb</h1>
        <h1 className="text-2xl font-bold text-center mb-8">สร้างบัญชีของคุณ</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-sm text-gray-400 mt-1">We suggest signing up with your work email address.</p>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="updates"
              className="mr-2"
              checked={sendUpdates}
              onChange={(e) => setSendUpdates(e.target.checked)}
            />
            <label htmlFor="updates" className="text-sm text-gray-300">
              Send me occasional product updates and announcements.
            </label>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 rounded font-semibold hover:bg-blue-700 transition duration-300"
          >
            Sign up
          </button>
        </form>
        <div className="text-center my-6 text-gray-400">OR</div>
        <button
          className="w-full p-3 bg-gray-800 rounded border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition duration-300"
        >
          <img src="/api/placeholder/20/20" alt="Google logo" className="mr-2 h-5 w-5" />
          Continue with Google
        </button>
        <p className="text-center mt-8 text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline"> Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default AniMebSignup;
