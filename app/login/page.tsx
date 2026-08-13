"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { EnvelopeIcon, KeyIcon, LockClosedIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const router = useRouter();
  
  // viewState can be: 'login', 'forgot-email', 'forgot-otp', 'reset-password'
  const [viewState, setViewState] = useState('login');
  
  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Security Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // ================= 1. HANDLE STANDARD LOGIN =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setIsLoading(false);
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= 4) {
          setIsLocked(true);
          setErrorMessage("Security Alert: Too many failed login attempts. Your account is temporarily locked.");
        } else {
          setErrorMessage(error.message || `Invalid email or password. You have ${4 - newAttempts} attempt(s) remaining.`);
        }
      } else {
        setFailedAttempts(0);
        console.log("Login successful! Session active for:", data.user?.email);
        
        // Force router refresh so Next.js middleware / server components recognize the auth cookie
        router.refresh();
        
        // Push directly to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Network error occurred during login. Please check your connection.");
      console.error("Login Crash:", err);
    }
  };

  // ================= 2. HANDLE FORGOT PASSWORD (EMAIL) =================
  const handleSendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      
      setIsLoading(false);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setViewState('forgot-otp');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Network error occurred.");
    }
  };

  // ================= 3. HANDLE FORGOT PASSWORD (VERIFY OTP) =================
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Only allow numbers

    const newInputs = [...otpInputs];
    newInputs[index] = value;
    setOtpInputs(newInputs);

    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Auto-focus previous on backspace
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    const token = otpInputs.join('');

    if (token.length < 6) {
      setErrorMessage("Please enter the full 6-digit code.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: 'recovery',
      });

      setIsLoading(false);

      if (error) {
        setErrorMessage("Invalid code. Please try again.");
      } else {
        setViewState('reset-password');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Network error occurred.");
    }
  };

  // ================= 4. HANDLE NEW PASSWORD SETTING =================
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
      } else {
        router.refresh();
        router.push('/dashboard');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Network error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-2xl shadow-lg mb-4 overflow-hidden bg-slate-900">
          <img src="https://res.cloudinary.com/dnipaby6h/image/upload/v1771695037/logo_zmbcjx.jpg" alt="Logo" className="w-full h-full object-cover"/>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {viewState === 'login' ? 'Welcome back' : 'Reset Password'}
        </h2>
        {viewState === 'login' && !isLocked && (
          <p className="mt-2 text-sm text-slate-600">
            Don't have an account? <Link href="/signup" className="font-bold text-green-600 hover:text-green-500">Sign up here</Link>
          </p>
        )}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-xl rounded-3xl border border-slate-100 relative overflow-hidden">
          
          {/* Universal Error Message Display */}
          {errorMessage && (
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold text-center animate-shake border ${isLocked ? 'bg-red-100 border-red-300 text-red-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
              {isLocked && <ShieldExclamationIcon className="w-6 h-6 mx-auto mb-1 text-red-600" />}
              {errorMessage}
            </div>
          )}

          {/* ================= VIEW: STANDARD LOGIN ================= */}
          {viewState === 'login' && (
            <form onSubmit={handleLogin} className={`space-y-5 sm:space-y-6 transition-opacity duration-300 ${isLocked ? 'opacity-50 pointer-events-none' : 'animate-fade-in-up'}`}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none transition disabled:bg-slate-50 disabled:text-slate-400 text-sm sm:text-base" 
                  placeholder="student@university.edu" 
                  disabled={isLoading || isLocked}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <button type="button" disabled={isLocked} onClick={() => {setViewState('forgot-email'); setErrorMessage('');}} className="text-xs sm:text-sm font-bold text-green-600 hover:text-green-500 disabled:opacity-50">
                    Forgot password?
                  </button>
                </div>
                <input 
                  required 
                  type="password" 
                  minLength={6} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none transition disabled:bg-slate-50 disabled:text-slate-400 text-sm sm:text-base" 
                  placeholder="••••••••" 
                  disabled={isLoading || isLocked}
                />
              </div>

              <div className="pt-2">
                <button disabled={isLoading || isLocked} type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-base sm:text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
                </button>
              </div>
            </form>
          )}

          {/* ================= VIEW: FORGOT PASSWORD - ENTER EMAIL ================= */}
          {viewState === 'forgot-email' && (
            <form onSubmit={handleSendResetOTP} className="space-y-5 sm:space-y-6 animate-fade-in-up">
              <div className="text-center mb-4 sm:mb-6">
                <EnvelopeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-xs sm:text-sm">Enter the email associated with your account and we'll send you an OTP to reset your password.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-slate-50 text-sm sm:text-base" 
                  placeholder="you@university.edu" 
                  disabled={isLoading}
                />
              </div>
              <div className="pt-2">
                <button disabled={isLoading} type="submit" className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-base sm:text-lg font-bold text-white bg-slate-900 hover:bg-slate-800 transition disabled:opacity-50">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Send Reset OTP'}
                </button>
              </div>
              <button type="button" onClick={() => {setViewState('login'); setErrorMessage('');}} className="w-full text-sm font-semibold text-slate-500 hover:text-slate-800 text-center mt-2">
                Back to Login
              </button>
            </form>
          )}

          {/* ================= VIEW: FORGOT PASSWORD - OTP ================= */}
          {viewState === 'forgot-otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-5 sm:space-y-6 animate-fade-in-up text-center">
              <LockClosedIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-2" />
              <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-6">Enter the 6-digit code we just sent to your email.</p>
              
              <div className="flex justify-between gap-1 sm:gap-2 max-w-xs mx-auto mb-4 sm:mb-6">
                  {otpInputs.map((val, index) => (
                    <input 
                      key={index} 
                      id={`otp-${index}`}
                      type="text" 
                      maxLength={1} 
                      value={val}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      required 
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-extrabold rounded-lg border-2 border-slate-300 focus:border-green-600 outline-none transition disabled:bg-slate-50" 
                      disabled={isLoading}
                    />
                  ))}
              </div>

              <button disabled={isLoading} type="submit" className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-base sm:text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Verify Code'}
              </button>
            </form>
          )}

          {/* ================= VIEW: FORGOT PASSWORD - NEW PASSWORD ================= */}
          {viewState === 'reset-password' && (
            <form onSubmit={handleSetNewPassword} className="space-y-5 sm:space-y-6 animate-fade-in-up">
              <div className="text-center mb-4 sm:mb-6">
                <KeyIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-2" />
                <p className="text-slate-600 text-xs sm:text-sm">Code verified! Please create a new, strong password.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
                  <input 
                    required type="password" minLength={8} 
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none disabled:bg-slate-50 text-sm sm:text-base" 
                    placeholder="••••••••" disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <input 
                    required type="password" minLength={8} 
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none disabled:bg-slate-50 text-sm sm:text-base" 
                    placeholder="••••••••" disabled={isLoading}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button disabled={isLoading} type="submit" className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-base sm:text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Reset Password & Enter'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}