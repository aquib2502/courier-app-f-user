"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle, AlertCircle, FileText, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [iecNumber, setIecNumber] = useState('');
    const [aadharProof, setAadharProof] = useState(null);
    const [panProof, setPanProof] = useState(null);
    const [gstProof, setGstProof] = useState(null);
    const [iecProof, setIecProof] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleToggleForm = () => {
        // Reset form when toggling
        setEmail('');
        setPassword('');
        setFullname('');
        setConfirmPassword('');
        setAadharNumber('');
        setPanNumber('');
        setGstNumber('');
        setIecNumber('');
        setAadharProof(null);
        setPanProof(null);
        setGstProof(null);
        setIecProof(null);
        setError('');
        setMessage('');
        setIsLogin((prev) => !prev);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:5000/api/user/loginUser', {
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
    
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simple validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        // Validate all required fields
        if (!fullname || !email || !password || !confirmPassword || !aadharNumber || !panNumber || !gstNumber || !iecNumber) {
            setError('All fields are required');
            setIsSubmitting(false);
            return;
        }

        // Validate all required files
        if (!aadharProof || !panProof || !gstProof || !iecProof) {
            setError('All document proofs are required');
            setIsSubmitting(false);
            return;
        }
        
        try {
            // Create FormData for file uploads
            const formData = new FormData();
            formData.append('fullname', fullname);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirmPassword', confirmPassword);
            formData.append('aadharNumber', aadharNumber);
            formData.append('panNumber', panNumber);
            formData.append('gstNumber', gstNumber);
            formData.append('iecNumber', iecNumber);
            formData.append('aadharProof', aadharProof);
            formData.append('panProof', panProof);
            formData.append('gstProof', gstProof);
            formData.append('iecProof', iecProof);

            const response = await axios.post('http://localhost:5000/api/user/registerUser', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            setMessage(response.data.message);
            setError('');
            
            // Slight delay before redirect for better UX
            setTimeout(() => {
                router.push('/home');
            }, 200);
    
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setMessage('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
                    <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
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
                                {isLogin ? "Welcome Back" : "Join Us"}
                            </h2>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? "login" : "signup"}
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                {/* Display error or success message */}
                                <AnimatePresence>
                                    {message && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
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
                                            exit={{ opacity: 0 }}
                                            className="flex items-center bg-red-500/20 text-red-300 text-sm rounded-xl p-3 mb-4"
                                        >
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">
                                    {/* Name input field for Sign Up */}
                                    {!isLogin && (
                                        <motion.div 
                                            className="relative"
                                            variants={inputVariants}
                                            whileFocus="focus"
                                            whileTap="focus"
                                        >
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                            <input
                                                type="text"
                                                name="name"
                                                className="w-full bg-white/10 border border-white/30 rounded-xl px-10 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                                placeholder="Full Name"
                                                value={fullname}
                                                onChange={(e) => setFullname(e.target.value)}
                                                required
                                            />
                                        </motion.div>
                                    )}

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

                                    {/* Confirm Password input field for Sign Up */}
                                    {!isLogin && (
                                        <motion.div 
                                            className="relative"
                                            variants={inputVariants}
                                            whileFocus="focus"
                                            whileTap="focus"
                                        >
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                className="w-full bg-white/10 border border-white/30 rounded-xl px-10 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </motion.div>
                                    )}

                                    {/* Additional fields for Sign Up */}
                                    {!isLogin && (
                                        <>
                                            {/* Aadhar Number */}
                                            <motion.div 
                                                className="relative"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                whileTap="focus"
                                            >
                                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="aadharNumber"
                                                    className="w-full bg-white/10 border border-white/30 rounded-xl px-10 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
                                                    placeholder="Aadhar Number"
                                                    value={aadharNumber}
                                                    onChange={(e) => setAadharNumber(e.target.value)}
                                                    maxLength="12"
                                                    required
                                                />
                                            </motion.div>

                                            {/* PAN Number */}
                                            <motion.div 
                                                className="relative"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                whileTap="focus"
                                            >
                                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="panNumber"
                                                    className="w-full bg-white/10 border border-white/30 rounded-xl px-10 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all uppercase"
                                                    placeholder="PAN Number"
                                                    value={panNumber}
                                                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                                    maxLength="10"
                                                    required
                                                />
                                            </motion.div>

                                            {/* GST Number */}
                                            <motion.div 
                                                className="relative"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                whileTap="focus"
                                            >
                                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="gstNumber"
                                                    className="w-full bg-white/10 border border-white/30 rounded-xl px-10 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all uppercase"
                                                    placeholder="GST Number"
                                                    value={gstNumber}
                                                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                                                    maxLength="15"
                                                    required
                                                />
                                            </motion.div>

                                            {/* IEC Number */}
                                            <motion.div 
                                                className="relative"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                whileTap="focus"
                                            >
                                                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="iecNumber"
                                                    className="w-full bg-white/10 border border-white/30 rounded-xl px-10 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all uppercase"
                                                    placeholder="IEC Number"
                                                    value={iecNumber}
                                                    onChange={(e) => setIecNumber(e.target.value.toUpperCase())}
                                                    maxLength="10"
                                                    required
                                                />
                                            </motion.div>

                                            {/* Document Upload Section */}
                                            <div className="space-y-4 mt-6">
                                                <h3 className="text-white/90 text-sm font-medium mb-3">Document Proofs (JPG, PNG, PDF)</h3>
                                                
                                                {/* Aadhar Proof */}
                                                <motion.div 
                                                    className="relative"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    whileTap="focus"
                                                >
                                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                                                                    if (!allowedTypes.includes(file.type)) {
                                                                        setError('Please upload only JPG, PNG, or PDF files');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    if (file.size > 5 * 1024 * 1024) {
                                                                        setError('File size should be less than 5MB');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    setAadharProof(file);
                                                                    setError('');
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                            required
                                                        />
                                                        <div className={`w-full ${aadharProof ? 'bg-emerald-500/20 border-emerald-400/50' : 'bg-white/10 border-white/30'} border rounded-xl px-10 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all cursor-pointer flex items-center justify-between`}>
                                                            <span className={aadharProof ? 'text-emerald-200' : 'text-white/60'}>
                                                                {aadharProof ? `✓ ${aadharProof.name}` : 'Upload Aadhar Proof'}
                                                            </span>
                                                            {aadharProof ? (
                                                                <CheckCircle className="w-4 h-4 text-emerald-300" />
                                                            ) : (
                                                                <Upload className="w-4 h-4 text-white/70" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* PAN Proof */}
                                                <motion.div 
                                                    className="relative"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    whileTap="focus"
                                                >
                                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                                                                    if (!allowedTypes.includes(file.type)) {
                                                                        setError('Please upload only JPG, PNG, or PDF files');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    if (file.size > 5 * 1024 * 1024) {
                                                                        setError('File size should be less than 5MB');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    setPanProof(file);
                                                                    setError('');
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                            required
                                                        />
                                                        <div className={`w-full ${panProof ? 'bg-emerald-500/20 border-emerald-400/50' : 'bg-white/10 border-white/30'} border rounded-xl px-10 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all cursor-pointer flex items-center justify-between`}>
                                                            <span className={panProof ? 'text-emerald-200' : 'text-white/60'}>
                                                                {panProof ? `✓ ${panProof.name}` : 'Upload PAN Proof'}
                                                            </span>
                                                            {panProof ? (
                                                                <CheckCircle className="w-4 h-4 text-emerald-300" />
                                                            ) : (
                                                                <Upload className="w-4 h-4 text-white/70" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* GST Proof */}
                                                <motion.div 
                                                    className="relative"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    whileTap="focus"
                                                >
                                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                                                                    if (!allowedTypes.includes(file.type)) {
                                                                        setError('Please upload only JPG, PNG, or PDF files');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    if (file.size > 5 * 1024 * 1024) {
                                                                        setError('File size should be less than 5MB');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    setGstProof(file);
                                                                    setError('');
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                            required
                                                        />
                                                        <div className={`w-full ${gstProof ? 'bg-emerald-500/20 border-emerald-400/50' : 'bg-white/10 border-white/30'} border rounded-xl px-10 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all cursor-pointer flex items-center justify-between`}>
                                                            <span className={gstProof ? 'text-emerald-200' : 'text-white/60'}>
                                                                {gstProof ? `✓ ${gstProof.name}` : 'Upload GST Proof'}
                                                            </span>
                                                            {gstProof ? (
                                                                <CheckCircle className="w-4 h-4 text-emerald-300" />
                                                            ) : (
                                                                <Upload className="w-4 h-4 text-white/70" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* IEC Proof */}
                                                <motion.div 
                                                    className="relative"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    whileTap="focus"
                                                >
                                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                                                                    if (!allowedTypes.includes(file.type)) {
                                                                        setError('Please upload only JPG, PNG, or PDF files');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    if (file.size > 5 * 1024 * 1024) {
                                                                        setError('File size should be less than 5MB');
                                                                        e.target.value = '';
                                                                        return;
                                                                    }
                                                                    setIecProof(file);
                                                                    setError('');
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                            required
                                                        />
                                                        <div className={`w-full ${iecProof ? 'bg-emerald-500/20 border-emerald-400/50' : 'bg-white/10 border-white/30'} border rounded-xl px-10 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all cursor-pointer flex items-center justify-between`}>
                                                            <span className={iecProof ? 'text-emerald-200' : 'text-white/60'}>
                                                                {iecProof ? `✓ ${iecProof.name}` : 'Upload IEC Proof'}
                                                            </span>
                                                            {iecProof ? (
                                                                <CheckCircle className="w-4 h-4 text-emerald-300" />
                                                            ) : (
                                                                <Upload className="w-4 h-4 text-white/70" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </>
                                    )}

                                    {/* Forgot password link */}
                                    {isLogin && (
                                        <div className="text-right">
                                            <a href="#" className="text-sm text-teal-300 hover:text-white transition-all">
                                                Forgot password?
                                            </a>
                                        </div>
                                    )}

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
                                                <span>{isLogin ? "Sign In" : "Create Account"}</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>

                                    {/* Or divider */}
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/20"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-transparent text-white/60">or</span>
                                        </div>
                                    </div>

                                    {/* Toggle between Sign In and Sign Up */}
                                    <p className="text-white/80 text-center text-sm">
                                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                        <button
                                            type="button"
                                            onClick={handleToggleForm}
                                            className="text-emerald-300 font-semibold hover:text-white transition-all"
                                        >
                                            {isLogin ? "Sign Up" : "Sign In"}
                                        </button>
                                    </p>
                                </form>
                            </motion.div>
                        </AnimatePresence>
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