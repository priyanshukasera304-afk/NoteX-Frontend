import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    // 1. Logic aur States (Same wahi hain)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); // Ek error state bhi add ki hai

    const { name, email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            // Yeh hamari API hit ho rahi hai!
            const res = await axios.post('https://note-x-backend-priyanshu-projects2.vercel.app/api/auth/signup', formData);
            setMessage(res.data.message); // "User registered safely!"
            setFormData({ name: '', email: '', password: '' }); // Form clear kar do
        } catch (err) {
            setError(err.response?.data?.message || "Kuch gadbad ho gayi");
        }
    };

    return (
        // 🎨 MAINAWALA MODERN DESIGN YAHAN HAI 🎨
        <div className="flex justify-center items-center h-screen bg-gray-950 font-sans text-white">

            {/* Soft background glow */}
            
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/30 via-gray-950 to-gray-950"></div>

            <form onSubmit={onSubmit} className="relative z-10 bg-gray-900 p-10 rounded-2xl shadow-[0_0_60px_-15px_rgba(20,184,166,0.3)] w-[420px] border border-gray-800">

                {/* Heading */}
                <h2 className="text-3xl font-extrabold mb-10 text-center tracking-tight text-white">
                    Start Your <span className="text-teal-400">Journey</span>
                </h2>

                {/* Success Message Styling */}
                {message && (
                    <div className="bg-teal-900/40 border border-teal-600 text-teal-300 p-3 rounded-lg text-center mb-6 text-sm font-medium">
                        {message}
                    </div>
                )}

                {/* Error Message Styling */}
                {error && (
                    <div className="bg-red-950/40 border border-red-600 text-red-300 p-3 rounded-lg text-center mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Name Input */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Your Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                        placeholder="Lucknow Dev"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-200 placeholder-gray-600"
                        required
                    />
                </div>

                {/* Email Input */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Work Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="lucknowdev@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-200 placeholder-gray-600"
                        required
                    />
                </div>

                {/* Password Input */}
                <div className="mb-10">
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Set Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="•••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition duration-200 placeholder-gray-600"
                        required
                    />
                </div>

                {/* Styled Sign Up Button */}
                <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 p-3 rounded-xl text-lg font-bold transition duration-300 active:scale-95 shadow-md shadow-teal-500/20">
                    Create Account
                </button>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-teal-400 hover:underline font-semibold">
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;