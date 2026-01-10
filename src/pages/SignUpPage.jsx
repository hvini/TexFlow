import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 1. Create User in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Profile (DisplayName)
            await updateProfile(user, {
                displayName: name
            });

            // 3. Create User Document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                createdAt: new Date(),
                tier: 'free',
                compileCount: 0,
                lastReset: new Date()
            });

            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already in use.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-gray-950 items-center justify-center font-sans text-gray-200">
            <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Create Account
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-300 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="user@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-2 w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-lg transform transition-all active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
