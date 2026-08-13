"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase'; // Connected to save data
import { 
  UserIcon, 
  BookOpenIcon, 
  CheckBadgeIcon, 
  AcademicCapIcon, 
  BriefcaseIcon 
} from '@heroicons/react/24/outline';

export default function NewUserOnboarding() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  // Real user data states
  const [role, setRole] = useState<'student' | 'educator'>('student'); 
  const [profileData, setProfileData] = useState({ name: '', institution: '' });

  // Form States
  const [unitCount, setUnitCount] = useState<number | ''>('');
  const [unitNames, setUnitNames] = useState<string[]>([]);

  // --- FETCH USER DATA ON LOAD ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata) {
        const meta = user.user_metadata;
        const firstName = meta.first_name || '';
        const lastName = meta.last_name || '';
        
        setProfileData({ 
          name: `${firstName} ${lastName}`.trim() || 'Student', 
          institution: meta.institution || 'My University' 
        });
        
        if (meta.role === 'educator' || meta.role === 'student') {
          setRole(meta.role);
        }
      }
    };
    fetchUser();
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof unitCount === 'number' && unitCount > 0 && unitCount <= 13) {
      setUnitNames(Array(unitCount).fill(''));
      setStep(2);
    } else {
      alert("Please enter a valid number of units (maximum 13).");
    }
  };

  const handleUnitNameChange = (index: number, value: string) => {
    const newUnits = [...unitNames];
    newUnits[index] = value;
    setUnitNames(newUnits);
  };

  // --- SAVE UNITS TO SUPABASE & REDIRECT ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (unitNames.some(name => name.trim() === '')) {
      alert("Please fill in the names for all your units.");
      setIsSaving(false);
      return;
    }

    // Format the array exactly how the Dashboard expects it
    const formattedUnits = unitNames.map((name, index) => ({
      id: Date.now() + index, // Ensure unique IDs
      name: name.trim(),
      lecturer: '',
      target: 70, // Default target
      isTechnical: false,
      streak: 0,
      lastInteractionWeek: 0,
      currentAvg: 0,
      assignmentCount: 2,
      catCount: 2,
      labCount: 0
    }));

    // Save directly to the user's secure metadata
    const { error } = await supabase.auth.updateUser({
      data: { myUnits: formattedUnits }
    });

    setIsSaving(false);

    if (error) {
      alert("Error saving your setup: " + error.message);
    } else {
      router.push('/dashboard');
    }
  };

  // --- DYNAMIC STYLING & TEXT BASED ON ROLE ---
  const isStudent = role === 'student';
  const themeColor = isStudent ? 'green' : 'blue';
  
  const profileTitle = isStudent ? 'Student Profile' : 'Educator Profile';
  const countQuestion = isStudent ? 'How many units are you taking this semester?' : 'How many units/subjects do you teach?';
  const countSubtext = isStudent ? 'You can add up to 13 units to your study tracker.' : 'You can add up to 13 subjects to manage your classes.';
  
  const namingTitle = isStudent ? 'Name your Units' : 'Name your Subjects';
  const namingSubtext = isStudent ? 'What are you studying this semester? Enter the exact unit names.' : 'What subjects are you teaching? Enter the exact course codes or names.';
  const placeholderText = isStudent ? 'e.g. Thermodynamics II' : 'e.g. Intro to Mechanical Engineering';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      
      {/* TEMP DEVELOPER TOGGLE (Remove before launching) */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md border border-slate-200 text-xs font-bold flex gap-2">
        <span className="text-slate-500 pt-1">Test View:</span>
        <button onClick={() => {setRole('student'); setStep(1);}} className={`px-3 py-1 rounded ${isStudent ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Student</button>
        <button onClick={() => {setRole('educator'); setStep(1);}} className={`px-3 py-1 rounded ${!isStudent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>Educator</button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        
        {/* Progress Tracker */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-500 ${step === 2 ? 'w-full' : 'w-1/2'} ${isStudent ? 'bg-green-500' : 'bg-blue-500'}`}></div>
            
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 ${step >= 1 ? (isStudent ? 'bg-green-500 border-green-100 text-white' : 'bg-blue-500 border-blue-100 text-white') : 'bg-white border-slate-200 text-slate-400'}`}>1</div>
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors duration-500 ${step >= 2 ? (isStudent ? 'bg-green-500 border-green-100 text-white' : 'bg-blue-500 border-blue-100 text-white') : 'bg-white border-slate-200 text-slate-400'}`}>2</div>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 mt-2 px-1">
            <span>Verify Profile</span>
            <span>{isStudent ? 'Add Units' : 'Add Subjects'}</span>
          </div>
        </div>

        <div className="bg-white py-10 px-6 shadow-2xl sm:rounded-3xl sm:px-12 border border-slate-100">
          
          {/* ================= STEP 1: VERIFY PROFILE & UNIT COUNT ================= */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${isStudent ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {isStudent ? <AcademicCapIcon className="h-8 w-8" /> : <BriefcaseIcon className="h-8 w-8" />}
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Let's set up your workspace</h2>
                <p className="text-slate-600">Review your details below and configure your academic semester.</p>
              </div>

              <form onSubmit={handleContinue} className="space-y-8">
                
                {/* Profile Review Section */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">{profileTitle}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                      <input type="text" readOnly defaultValue={profileData.name} className={`w-full px-4 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 bg-white ${isStudent ? 'focus:ring-green-600' : 'focus:ring-blue-600'}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Institution</label>
                      <input type="text" readOnly defaultValue={profileData.institution} className={`w-full px-4 py-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 bg-white ${isStudent ? 'focus:ring-green-600' : 'focus:ring-blue-600'}`} />
                    </div>
                  </div>
                </div>

                {/* Unit Count Section */}
                <div className={`p-6 rounded-2xl border ${isStudent ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${isStudent ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      <BookOpenIcon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <label className={`block text-lg font-extrabold mb-1 ${isStudent ? 'text-green-900' : 'text-blue-900'}`}>
                        {countQuestion}
                      </label>
                      <p className={`text-sm mb-4 ${isStudent ? 'text-green-700' : 'text-blue-700'}`}>
                        {countSubtext}
                      </p>
                      
                      <input 
                        required 
                        type="number" 
                        min="1" 
                        max="13" 
                        value={unitCount}
                        onChange={(e) => setUnitCount(e.target.value === '' ? '' : Number(e.target.value))}
                        className={`w-32 px-4 py-3 text-2xl font-black text-center rounded-xl border-2 outline-none shadow-sm focus:ring-0 ${
                          isStudent 
                          ? 'border-green-300 focus:border-green-600' 
                          : 'border-blue-300 focus:border-blue-600'
                        }`} 
                        placeholder="e.g. 7" 
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-slate-900 hover:bg-slate-800 transition">
                  Continue to Add {isStudent ? 'Units' : 'Subjects'} →
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 2: DYNAMIC UNIT NAMING ================= */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-8">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${isStudent ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  <BookOpenIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{namingTitle}</h2>
                <p className="text-slate-600">{namingSubtext}</p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Dynamically Generate Input Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-2">
                  {unitNames.map((unit, index) => (
                    <div key={index} className="relative">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                        {isStudent ? 'Unit' : 'Subject'} {index + 1}
                      </label>
                      <input 
                        required
                        type="text" 
                        value={unit}
                        onChange={(e) => handleUnitNameChange(index, e.target.value)}
                        placeholder={`${placeholderText} ${index + 1}`}
                        className={`w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-transparent outline-none shadow-sm transition bg-slate-50 focus:bg-white focus:ring-2 ${isStudent ? 'focus:ring-green-600' : 'focus:ring-blue-600'}`} 
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                    ← Back
                  </button>
                  <button disabled={isSaving} type="submit" className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-xl shadow-lg text-lg font-bold text-white transition disabled:opacity-50 ${isStudent ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isSaving ? 'Setting up Dashboard...' : 'Save & Enter Dashboard'}
                    {!isSaving && <CheckBadgeIcon className="w-6 h-6" />}
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