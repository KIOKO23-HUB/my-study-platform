"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AcademicCapIcon, BriefcaseIcon, CheckCircleIcon, KeyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

const countryCodes = [
  { code: "+254", country: "Kenya" }, { code: "+256", country: "Uganda" },
  { code: "+255", country: "Tanzania" }, { code: "+250", country: "Rwanda" },
  { code: "+257", country: "Burundi" }, { code: "+211", country: "South Sudan" },
  { code: "+234", country: "Nigeria" }, { code: "+27", country: "South Africa" },
  { code: "+233", country: "Ghana" }, { code: "+20", country: "Egypt" },
  { code: "+251", country: "Ethiopia" }, { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" }, { code: "+91", country: "India" },
  { code: "+971", country: "UAE" }, { code: "+00", country: "Other" }
];

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(''); 
  const [selectedCode, setSelectedCode] = useState('+254'); 
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectRole = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(2);
    setErrorMessage('');
  };

  // ========== 1. CAPTURE ALL DATA & FIRE SUPABASE OTP EMAIL ==========
  const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    const formData = new FormData(e.currentTarget);
    const userEmail = formData.get('email') as string;
    setEmail(userEmail);

    const userMetaData = {
      role: role,
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      username: formData.get('username') || '',
      country: formData.get('country'),
      mobile: selectedCode + formData.get('mobile'),
      institution: formData.get('institution'),
      course: formData.get('course') || formData.get('specialization') || '',
      dob: formData.get('dob') || '',
      year_of_study: formData.get('yearOfStudy') || ''
    };

    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
      options: {
        shouldCreateUser: true,
        data: userMetaData 
      }
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setStep(3);
    }
  };

  // ========== 2. HANDLE OTP INPUT & BACKSPACE LOGIC ==========
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input automatically
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Focus previous input automatically on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && e.currentTarget.previousSibling) {
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter the full 6-digit code.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: enteredOtp,
      type: 'email'
    });

    setLoading(false);

    if (error) {
      setErrorMessage("Invalid code. Please try again.");
    } else {
      setStep(4);
    }
  };

  // ========== 3. SET PASSWORD & FINISH ==========
  const handleSetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      router.push('/newusers');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl text-white font-bold text-xl sm:text-2xl shadow-lg mb-4">SP</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Join StudyPlatform AI</h2>
        <p className="mt-2 text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-bold text-green-600 hover:text-green-500">Log in here</Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow-xl rounded-3xl border border-slate-100">
          
          {errorMessage && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 flex items-center gap-2 animate-shake">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
          
          {/* STEP 1: ROLE */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h3 className="text-lg sm:text-xl font-bold text-center mb-6 text-slate-800">I am joining as a...</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => selectRole('student')} className="flex flex-col items-center p-6 sm:p-8 border-2 border-slate-200 rounded-2xl hover:border-green-500 hover:bg-green-50 transition group">
                  <AcademicCapIcon className="w-14 h-14 sm:w-16 sm:h-16 text-slate-400 group-hover:text-green-600 mb-4" />
                  <span className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-green-700">Student</span>
                  <span className="text-xs sm:text-sm text-slate-500 text-center mt-2">I want to track marks, scan notes, and use AI tools.</span>
                </button>
                <button onClick={() => selectRole('educator')} className="flex flex-col items-center p-6 sm:p-8 border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition group">
                  <BriefcaseIcon className="w-14 h-14 sm:w-16 sm:h-16 text-slate-400 group-hover:text-blue-600 mb-4" />
                  <span className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-700">Educator</span>
                  <span className="text-xs sm:text-sm text-slate-500 text-center mt-2">I want to upload materials and guide my students.</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: STUDENT PROFILE */}
          {step === 2 && role === 'student' && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">Student Profile Setup</h3>
                <button onClick={() => setStep(1)} className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 font-medium">← Back</button>
              </div>

              <form onSubmit={handleDetailsSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">First Name</label>
                    <input name="firstName" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none text-sm" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Second Name</label>
                    <input name="lastName" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none text-sm" placeholder="Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Username</label>
                    <input name="username" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none text-sm" placeholder="johndoe99" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                    <input name="email" required type="email" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none text-sm" placeholder="student@university.edu" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Country</label>
                    <select name="country" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm">
                      <option>Kenya</option><option>Uganda</option><option>Tanzania</option><option>Rwanda</option><option>Nigeria</option><option>South Africa</option><option>Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <div className="flex">
                      <select 
                        className="inline-flex items-center px-2 py-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                        value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)}
                      >
                        {countryCodes.map((c) => (
                          <option key={c.country} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <input name="mobile" required type="tel" className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none text-sm" placeholder="700 000 000" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Institution</label>
                    <input name="institution" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none text-sm" placeholder="e.g. DeKUT, UoN" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Course</label>
                    <select name="course" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm">
                      <option value="">Select your course...</option>
                      <optgroup label="Engineering & Technology">
                        <option>BSc Mechanical Engineering</option>
                        <option>BSc Civil Engineering</option>
                        <option>BSc Computer Science</option>
                      </optgroup>
                      <optgroup label="Education & Arts">
                        <option>BEd (Arts)</option>
                        <option>BEd (Science)</option>
                        <option>B.A Communication</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option>TVET / Diploma Courses</option>
                        <option>Other Specialization</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input name="dob" required type="date" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none text-slate-600 bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Year of Study</label>
                    <select name="yearOfStudy" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none bg-white text-sm">
                      <option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option><option>Year 5</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 sm:pt-6">
                  <button disabled={loading} type="submit" className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-base sm:text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Send Verification Code"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: EDUCATOR PROFILE */}
          {step === 2 && role === 'educator' && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">Educator Profile Setup</h3>
                <button onClick={() => setStep(1)} className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 font-medium">← Back</button>
              </div>

              <form onSubmit={handleDetailsSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">First Name</label>
                    <input name="firstName" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="Jane" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Second Name</label>
                    <input name="lastName" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="Smith" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Professional Email</label>
                    <input name="email" required type="email" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="lecturer@university.ac.ke" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Department</label>
                    <input name="institution" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="e.g. Mechanical Dept." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Country</label>
                    <select name="country" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white text-sm">
                      <option>Kenya</option><option>Uganda</option><option>Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <div className="flex">
                      <select 
                        className="inline-flex items-center px-2 py-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        value={selectedCode} onChange={(e) => setSelectedCode(e.target.value)}
                      >
                        {countryCodes.map((c) => (
                          <option key={c.country} value={c.code}>{c.code}</option>
                        ))}
                      </select>
                      <input name="mobile" required type="tel" className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm" placeholder="700 000 000" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 sm:pt-6">
                  <button disabled={loading} type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base sm:text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Send Verification Code"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: OTP */}
          {step === 3 && (
            <div className="animate-fade-in-up text-center py-4 sm:py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-slate-100 mb-4 sm:mb-6">
                <CheckCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-slate-800" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Verify your email</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 sm:mb-8 max-w-sm mx-auto">We've sent a 6-digit code to <strong>{email}</strong>.</p>

              <form onSubmit={handleOTPVerify} className="max-w-xs mx-auto space-y-6">
                <div className="flex justify-between gap-1 sm:gap-2">
                  {otp.map((data, index) => (
                    <input 
                      key={index} 
                      type="text" 
                      maxLength={1} 
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onKeyDown={e => handleOtpKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                      className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-extrabold rounded-lg border-2 border-slate-300 focus:ring-0 outline-none transition ${role === 'student' ? 'focus:border-green-600' : 'focus:border-blue-600'}`} 
                    />
                  ))}
                </div>
                <button disabled={loading} type="submit" className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-base sm:text-lg font-bold text-white bg-slate-900 hover:bg-slate-800 transition disabled:opacity-50">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Verify Code"}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: PASSWORD */}
          {step === 4 && (
            <div className="animate-fade-in-up py-4 sm:py-8 max-w-md mx-auto">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full mb-4 sm:mb-6 ${role === 'student' ? 'bg-green-100' : 'bg-blue-100'}`}>
                <KeyIcon className={`h-6 w-6 sm:h-8 sm:w-8 ${role === 'student' ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 text-center">Secure Your Account</h3>
              <p className="text-slate-600 mb-6 sm:mb-8 text-center text-xs sm:text-sm">Create a unique password. It must be at least 8 characters long.</p>

              <form onSubmit={handleSetPassword} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Create Password</label>
                  <input name="password" required type="password" minLength={8} className={`w-full px-4 py-2.5 sm:py-3 rounded-lg border border-slate-300 focus:ring-2 focus:border-transparent outline-none transition text-sm sm:text-base ${role === 'student' ? 'focus:ring-green-600' : 'focus:ring-blue-600'}`} placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input name="confirmPassword" required type="password" minLength={8} className={`w-full px-4 py-2.5 sm:py-3 rounded-lg border border-slate-300 focus:ring-2 focus:border-transparent outline-none transition text-sm sm:text-base ${role === 'student' ? 'focus:ring-green-600' : 'focus:ring-blue-600'}`} placeholder="••••••••" />
                </div>
                <div className="pt-2 sm:pt-4">
                  <button disabled={loading} type="submit" className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base sm:text-lg font-bold text-white transition disabled:opacity-50 ${role === 'student' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Finish & Set Up Workspace"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}