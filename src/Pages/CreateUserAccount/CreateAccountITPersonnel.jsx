import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../../assets/logo.jpeg';

const  CreateAccountITPersonnel = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      email,
      password,
      phone_number: phoneNumber,
      first_name: firstName,
      last_name: lastName,
      role: "IT_PERSONNEL"
    };

    try {
      const response = await fetch('http://techaid-001-site1.ptempurl.com/api/Employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row w-full max-w-6xl min-h-[70vh]">
        
          {/* Left Side - Logo */}
          <div className="md:w-1/2 flex flex-col items-center justify-center p-8">
          <img src={logo} alt="Optimus TechAid" className="w-[280px] h-[280px]" />
          <h2 className="text-3xl font-bold text-blue-900 mt-4">OPTIMUS</h2> 
          <h2 className="text-3xl font-bold text-blue-900">TECHAID</h2>
        </div>

        {/* Right Side - Signup Form */}
        <div className="md:w-5/6 p-8 flex flex-col justify-center"> 
          <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-500 text-base">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border-b border-gray-400 focus:border-blue-500 outline-none text-lg py-1 bg-transparent"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 text-base">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border-b border-gray-400 focus:border-blue-500 outline-none text-lg py-1 bg-transparent"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 text-base">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border-b border-gray-400 focus:border-blue-500 outline-none text-lg py-1 bg-transparent"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 text-base">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-400 focus:border-blue-500 outline-none text-lg py-1 bg-transparent"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 text-base">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-400 focus:border-blue-500 outline-none text-lg py-1 bg-transparent"
                autoComplete="off"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-900 text-white py-5 text-lg rounded-lg hover:bg-blue-700 mt-24">
              Create Account
            </button>
          </form>
          <p className="mt-8 text-center text-gray-600 text-lg">
            Already have an account? <Link to="/" className="text-blue-500">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountITPersonnel;
