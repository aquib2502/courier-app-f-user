"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, Phone, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

    const handleToggleForm = () => {
        setIsLogin((prev) => !prev); // Toggle the form state between login and signup
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic
    };

    const handleRegister = (e) => {
        e.preventDefault();
        // Handle registration logic
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Section - Form */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
                        <div className="flex items-center justify-center mb-8">
                            <ShieldCheck className="w-8 h-8 text-emerald-400 mr-2" />
                            <h2 className="text-3xl font-bold text-white">
                                 {isLogin ? "Sign In" : "Sign Up"}
                            </h2>
                        </div>

                        {/* Add your message and error handling here */}

                        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                            {/* Name input field for Sign Up */}
                            {!isLogin && (
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                            )}

                            {/* Email input field */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>
                            
                            {/* Password input field */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            {/* Confirm Password input field for Sign Up */}
                            {!isLogin && (
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                        placeholder="Confirm Password"
                                        required
                                    />
                                </div>
                            )}

                            {/* Submit button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-900 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-all"
                            >
                                <span>{isLogin ? "Sign In" : "Create Account"}</span>
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>

                            {/* Toggle between Sign In and Sign Up */}
                            <p className="text-white/80 text-center mt-6">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                <button
                                    type="button"
                                    onClick={handleToggleForm} // Toggle between login and signup
                                    className="text-emerald-400 font-semibold hover:text-emerald-300 transition-all"
                                >
                                    {isLogin ? "Sign Up" : "Sign In"}
                                </button>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>

            {/* Right Section - Image */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:block w-1/2 relative overflow-hidden"
            >
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                        backgroundImage: "url('./Login-Image.jpg')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />
            </motion.div>
        </div>
    );
};

export default Login;
