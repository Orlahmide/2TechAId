import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../assets/logo.jpeg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5215/api/Employees/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('userRole', data.role);

      login(data.role);
      toast.success('Login successful!');

      switch (data.role) {
        case 'IT_PERSONNEL':
          navigate('/iTDashboard');
          break;
        case 'BANK_STAFF':
          navigate('/staffDashboard');
          break;
        case 'ADMIN':
          navigate('/AdminDashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-900 to-green-300">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row w-full max-w-6xl min-h-[70vh]">
        
        {/* Left Side - Logo */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-8">
        <img src={logo} alt="Optimus TechAid" className="w-[280px] h-[280px]" />
          <h2 className="text-3xl font-bold text-blue-900 mt-4">OPTIMUS</h2> 
          <h2 className="text-3xl font-bold text-blue-900">TECHAID</h2>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-5/6 p-8 flex flex-col justify-center"> 
          <h1 className="text-3xl font-semibold mb-8">Sign-In</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-gray-400 text-lg">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-gray-400 focus:border-blue-500 outline-none text-lg py-2 bg-transparent appearance-none autofill-fix"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-lg">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-gray-400 focus:border-blue-500 outline-none text-lg py-2 bg-transparent appearance-none autofill-fix "
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-900 text-white py-5 text-lg rounded-lg hover:bg-blue-700 mt-24">
              Login
            </button>
          </form>
         
        </div>

      </div>
    </div>
  );
};

export default Login;
