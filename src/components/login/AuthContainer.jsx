"use client";
import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

const AuthContainer = () => {
    const [currentView, setCurrentView] = useState('login'); // 'login' or 'signup'

    const handleToggleToSignup = () => {
        setCurrentView('signup');
    };

    const handleToggleToLogin = () => {
        setCurrentView('login');
    };

    return (
        <>
            {currentView === 'login' ? (
                <Login onToggleToSignup={handleToggleToSignup} />
            ) : (
                <SignUp onToggleToLogin={handleToggleToLogin} />
            )}
        </>
    );
};

export default AuthContainer;