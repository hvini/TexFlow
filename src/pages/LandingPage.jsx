import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if already logged in
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigate('/dashboard');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex items-center gap-3 rtl:space-x-reverse">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-lg text-white">T</span>
                        </div>
                        <span className="self-center text-xl font-bold whitespace-nowrap tracking-tight">TeXFlow</span>
                    </Link>
                    <div className="flex space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <Link
                            to="/login"
                            className="text-gray-300 hover:text-white font-medium text-sm px-4 py-2 text-center transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-white bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg text-sm px-4 py-2 text-center shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Abstract Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 px-4 mx-auto max-w-7xl text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        v1.0 is Live
                    </div>
                    <h1 className="mb-6 text-5xl font-extrabold tracking-tight leading-none text-white md:text-6xl lg:text-7xl">
                        LaTeX papers, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            reimagined visually.
                        </span>
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-400 lg:text-xl sm:px-16 lg:px-48">
                        Stop wrestling with complex syntax. Build your research papers using intuitive flowcharts
                        blocks and let TeXFlow handle the compilation.
                    </p>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <Link to="/signup" className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-900 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1">
                            Start Building for Free
                            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </Link>
                        <Link to="/login" className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-gray-300 rounded-lg border border-gray-700 hover:text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-800 transition-all">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-20 bg-gray-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative group perspective">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-gray-900 ring-1 ring-gray-800 rounded-lg p-6 font-mono text-sm leading-relaxed text-gray-400 h-80 overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all">
                                <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <span className="text-purple-400">\documentclass</span>&#123;article&#125;<br />
                                <span className="text-blue-400">\usepackage</span>&#123;graphicx&#125;<br />
                                <span className="text-blue-400">\begin</span>&#123;document&#125;<br />
                                <span className="text-blue-400">\section</span>&#123;Introduction&#125;<br />
                                Here is some text.<br />
                                <span className="text-red-400">% TODO: Fix this mess</span><br />
                                <span className="text-blue-400">\begin</span>&#123;figure&#125;[h]<br />
                                \centering... <br />
                                <span className="animate-pulse">_</span>
                            </div>
                            <div className="absolute top-4 right-4 bg-red-500/20 text-red-300 text-xs font-bold px-2 py-1 rounded border border-red-500/30">
                                THE OLD WAY
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
                            <div className="relative bg-gray-900 ring-1 ring-gray-800 rounded-lg p-1 h-80 overflow-hidden flex items-center justify-center">
                                <div className="relative w-full h-full bg-gray-950/50 rounded flex items-center justify-center">
                                    {/* Mock Graph */}
                                    <div className="flex flex-col items-center gap-8">
                                        <div className="w-32 h-12 bg-indigo-600/20 border border-indigo-500 text-indigo-200 rounded-md flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.2)]">
                                            Root
                                        </div>
                                        <div className="w-0.5 h-8 bg-gray-700"></div>
                                        <div className="flex gap-8">
                                            <div className="w-28 h-10 bg-gray-800 border border-gray-600 text-gray-400 rounded flex items-center justify-center text-xs">
                                                Introduction
                                            </div>
                                            <div className="w-28 h-10 bg-gray-800 border border-gray-600 text-gray-400 rounded flex items-center justify-center text-xs">
                                                Methods
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-1 rounded border border-indigo-500/30">
                                THE TEXFLOW WAY
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <h2 className="text-3xl font-bold text-white">Visual Clarity, Native Performance</h2>
                        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                            Why write compilation code when you can design your paper's structure visually?
                            TeXFlow bridges the gap between mind-mapping and academic publishing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                            <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-indigo-900/50 text-indigo-300 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Modular Design</h3>
                            <p className="text-gray-400">Treat your document sections as independent nodes. Reorder, duplicate, and experiment with structure instantly.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-colors group">
                            <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-purple-900/50 text-purple-300 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Instant Compilation</h3>
                            <p className="text-gray-400">Server-side rendering powered by TeXLive. Get production-ready PDFs in seconds, not minutes.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-emerald-500/30 transition-colors group">
                            <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-emerald-900/50 text-emerald-300 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" /></svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">Cloud Synced</h3>
                            <p className="text-gray-400">Your research travels with you. Auto-saves to the cloud so you never lose a breakthrough moment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-gray-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Plans for Every Stage</h2>
                    <p className="text-gray-400 mb-16 max-w-2xl mx-auto">
                        Start for free and scale as your research needs grow. All plans include essential visual editing features.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center hover:border-gray-700 transition-colors relative overflow-hidden">
                            <div className="flex justify-between w-full items-baseline mb-8">
                                <span className="text-2xl font-bold text-white">Starter</span>
                                <span className="text-4xl font-extrabold text-white">Free</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-left w-full text-gray-300">
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    1 Active Project
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    10 Compiles per Day
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    30s Compilation Timeout
                                </li>
                                <li className="flex items-center gap-3 text-gray-500">
                                    Access to Basic Nodes
                                </li>
                            </ul>
                            <div className="mt-auto w-full">
                                <Link to="/signup" className="block w-full py-3 px-6 text-sm font-bold text-center text-white rounded-lg border border-gray-700 hover:bg-gray-800 transition-all">
                                    Start Now
                                </Link>
                            </div>
                        </div>

                        {/* Premium Tier */}
                        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/50 rounded-2xl p-8 flex flex-col items-center relative overflow-hidden ring-1 ring-indigo-500/50">
                            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                            <div className="flex justify-between w-full items-baseline mb-8">
                                <span className="text-2xl font-bold text-white">Researcher</span>
                                <div className="text-right">
                                    <span className="text-4xl font-extrabold text-white">$9</span>
                                    <span className="text-gray-400">/mo</span>
                                </div>
                            </div>
                            <ul className="space-y-4 mb-8 text-left w-full text-indigo-100">
                                <li className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-xs">✓</span>
                                    Unlimited Projects
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-xs">✓</span>
                                    Unlimited Compiles
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-xs">✓</span>
                                    Extended Timeout (120s)
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-xs">✓</span>
                                    Priority Support
                                </li>
                            </ul>
                            <div className="mt-auto w-full">
                                <Link to="/signup?plan=premium" className="block w-full py-3 px-6 text-sm font-bold text-center text-white rounded-lg bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]">
                                    Go Premium
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="p-4 bg-gray-950 md:p-8 lg:p-10 border-t border-white/5">
                <div className="mx-auto max-w-screen-xl text-center">
                    <span className="text-2xl font-semibold text-white tracking-tight">TeXFlow</span>
                    <p className="my-6 text-gray-500">Accelerating academic writing for the modern researcher.</p>
                    <span className="text-sm text-gray-500 sm:text-center">© 2026 TeXFlow™. All Rights Reserved.</span>
                </div>
            </footer>
        </div>
    );
}
