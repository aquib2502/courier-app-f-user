"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const Login = ({ onToggleToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/loginUser`, {
                email,
                password,
            });
    
            if (response.status === 200) {
                const { message, token } = response.data;
                localStorage.setItem('userToken', token);
                setMessage(message);
                setError('');
                
                // Slight delay before redirect for better UX
                setTimeout(() => {
                    router.push('/home');
                }, 800);
            } else {
                setError('Login failed, please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
            setMessage('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        blur: { scale: 1, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Section - Form */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-6 flex items-center justify-center overflow-hidden relative">
                {/* Background animated shapes */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl opacity-20 animate-blob"></div>
                    
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-overlay blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-300 rounded-full mix-blend-overlay blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                        <motion.div 
                            className="flex items-center justify-center mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ShieldCheck className="w-10 h-10 text-emerald-300 mr-3" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                Welcome Back
                            </h2>
                        </motion.div>

                        {/* Display error or success message */}
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center bg-emerald-500/20 text-emerald-200 text-sm rounded-xl p-3 mb-4"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {message}
                            </motion.div>
                        )}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center bg-red-500/20 text-red-300 text-sm rounded-xl p-3 mb-4"
                            >
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {error}
                            </motion.div>
                        )}

                        <div className="text-center mb-8">
                            <h3 className="text-xl font-semibold text-white mb-2">Sign In</h3>
                            <p className="text-white/70 text-sm">Enter your credentials to access your account</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email input field */}
                            <motion.div 
                                className="relative" 
                                variants={inputVariants}
                                whileFocus="focus"
                                whileTap="focus"
                            >
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-white/10 border border-white/30 rounded-xl px-10 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </motion.div>

                            {/* Password input field */}
                            <motion.div 
                                className="relative"
                                variants={inputVariants}
                                whileFocus="focus"
                                whileTap="focus"
                            >
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full bg-white/10 border border-white/30 rounded-xl px-10 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </motion.div>

                            {/* Forgot password link */}
                            <div className="text-right">
                                <a href="#" className="text-sm text-teal-300 hover:text-white transition-all">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full ${isSubmitting ? 'bg-teal-400/70' : 'bg-gradient-to-r from-emerald-400 to-teal-400'} 
                                    text-emerald-900 py-3.5 rounded-xl font-semibold flex items-center justify-center space-x-2 
                                    hover:shadow-lg hover:shadow-emerald-400/20 transition-all mt-6`}
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-emerald-800/20 border-t-emerald-900 animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Or divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-white/60">or</span>
                            </div>
                        </div>

                        {/* Toggle to Sign Up */}
                        <p className="text-white/80 text-center text-sm">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={onToggleToSignup}
                                className="text-emerald-300 font-semibold hover:text-white transition-all"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Section - Image */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:block w-1/2 relative overflow-hidden"
            >
                {/* Keep original image as requested */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('./Login-Image.jpg')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />
                
                {/* Added content overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Secure Access</h2>
                        <p className="text-white/80 text-lg max-w-md">
                            Your gateway to a safe and personalized experience. We prioritize 
                            your security and privacy with industry-leading protection.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;