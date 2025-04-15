import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!isLogin) {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            if (password.length < 8) {
                setError('Password must be at least 8 characters');
                return;
            }
        }

        setIsLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                await router.push('/admin');
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <h1 className="text-3xl font-bold text-center">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="mt-2 text-center text-blue-100">
                            {isLogin ? 'Sign in to access your account' : 'Sign up to get started'}
                        </p>
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {!isLogin && (
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex justify-end mb-4">
                                    <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <span>Loading...</span>
                                ) : isLogin ? (
                                    'Sign In'
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}