"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DocumentArrowUpIcon, 
  ChartBarIcon, 
  SparklesIcon, 
  FireIcon,
  CheckBadgeIcon,
  PresentationChartLineIcon,
  BookOpenIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

// 40 Top Kenyan Universities
const kenyanUniversities = [
  "University of Nairobi (UoN)", "Kenyatta University (KU)", "JKUAT", 
  "Egerton University", "Moi University", "Maseno University", 
  "Masinde Muliro (MMUST)", "Dedan Kimathi (DeKUT)", "Chuka University", 
  "Technical University of Kenya (TUK)", "TUM", "Pwani University", 
  "Kisii University", "University of Eldoret", "Maasai Mara University", 
  "JOOUST", "Laikipia University", "SEKU", "Meru University", 
  "Multimedia University (MMU)", "University of Kabianga", "Karatina University", 
  "Kibabii University", "Rongo University", "Co-operative University", 
  "Taita Taveta University", "Murang'a University", "University of Embu", 
  "Machakos University", "Kirinyaga University", "Garissa University", 
  "Strathmore University", "Mount Kenya University (MKU)", "USIU-Africa", 
  "Catholic University (CUEA)", "Daystar University", "Kabarak University", 
  "Africa Nazarene", "KeMU", "Zetech University"
];

// Slider Image Arrays
const heroImages = ['/image-1.jpg', '/image2.png.png'];
const featureImages = ['/slide-1.jpg', '/slide-2.jpg', '/slide-3.jpg', '/slide-4.jpg'];

export default function LandingPage() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [featureSlide, setFeatureSlide] = useState(0);

  // Auto-Sliding Timers
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // 4 seconds for hero slider

    const featureInterval = setInterval(() => {
      setFeatureSlide((prev) => (prev + 1) % featureImages.length);
    }, 4000); // 4 seconds for features slider

    return () => {
      clearInterval(heroInterval);
      clearInterval(featureInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden w-full max-w-[100vw] selection:bg-blue-200 selection:text-blue-900">
      
      {/* Decorative Background Elements (Constrained to prevent mobile horizontal scroll) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 w-full max-w-[100vw]">
        <div className="absolute top-0 inset-x-0 h-[50rem] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50"></div>
        <div className="absolute top-0 right-0 -mr-20 mt-20 w-72 sm:w-96 h-72 sm:h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 left-0 -ml-20 w-60 sm:w-72 h-60 sm:h-72 bg-green-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* ================= 1. NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm w-full">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer">
            <img 
              src="https://res.cloudinary.com/dnipaby6h/image/upload/v1771695037/logo_zmbcjx.jpg" 
              alt="StudyPlatform Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/50"
            />
            <span className="font-extrabold text-lg sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 tracking-tight">StudyPlatform</span>
          </div>
          <div className="hidden md:flex gap-8 font-semibold text-slate-600 text-sm sm:text-base">
            <Link href="#how-it-works" className="hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300">How it Works</Link>
            <Link href="#features" className="hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300">Features</Link>
            <Link href="#faq" className="hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300">FAQ</Link>
          </div>
          <Link href="/login" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 whitespace-nowrap">
            Login / Dashboard
          </Link>
        </div>
      </nav>

      {/* ================= 2. HERO SECTION ================= */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        <div className="space-y-6 sm:space-y-8 relative z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-blue-100 text-blue-800 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm mx-auto lg:mx-0">
            <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-red-200"></span>
            Built for University, College & TVET Students
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold tracking-tighter leading-[1.1] sm:leading-[1.05] text-slate-900 drop-shadow-sm">
            Your Complete <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Academic</span> Command Center.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Upload notes, track CATs and assignment marks, and let AI analyze your progress to pinpoint weaknesses. A program that will ease education in this era of technology.
          </p>

          <blockquote className="border-l-4 border-indigo-500 pl-4 sm:pl-5 py-3 text-slate-600 italic text-sm sm:text-base font-medium bg-white/50 backdrop-blur-sm rounded-r-2xl shadow-sm relative overflow-hidden text-left">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-transparent"></div>
            <span className="relative z-10">"Education is the passport to the future, for tomorrow belongs to those who prepare for it today."</span>
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6 justify-center lg:justify-start">
            <Link href="/login" className="group bg-slate-900 hover:bg-slate-800 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-base sm:text-lg text-center transition-all shadow-xl hover:shadow-2xl hover:shadow-slate-900/20 flex items-center justify-center gap-3">
              Start Learning Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </Link>
          </div>
        </div>

        {/* HERO SLIDER */}
        <div className="relative w-full aspect-square rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/10 border-8 sm:border-[12px] border-white bg-slate-100 max-w-md mx-auto lg:max-w-none">
          {heroImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`Hero Graphic ${idx + 1}`}
              fill
              priority={idx === 0}
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                idx === heroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/10 to-indigo-50/10 z-20 pointer-events-none"></div>
          
          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === heroSlide ? 'bg-blue-600 w-6' : 'bg-white/70 border border-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* ================= 3. SCROLLING UNIVERSITIES (RIGHT TO LEFT) ================= */}
      <section className="bg-white/50 backdrop-blur-md py-8 sm:py-12 border-y border-slate-200/60 overflow-hidden relative shadow-sm w-full">
        <p className="text-center text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-6 sm:mb-8 px-4">
          Students at 40+ leading Kenyan institutions trust our AI tool
        </p>
        
        <div className="w-full overflow-hidden flex relative">
          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll-left {
              display: flex;
              width: max-content;
              animation: marquee 35s linear infinite;
            }
            .animate-scroll-left:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="animate-scroll-left flex gap-12 sm:gap-16 items-center px-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
            {kenyanUniversities.map((uni, index) => (
              <h3 key={`set1-${index}`} className="text-base sm:text-xl font-black text-slate-400 hover:text-indigo-600 transition-colors cursor-default whitespace-nowrap tracking-tight">
                {uni}
              </h3>
            ))}
            {/* Duplicate set for seamless infinite loop */}
            {kenyanUniversities.map((uni, index) => (
              <h3 key={`set2-${index}`} className="text-base sm:text-xl font-black text-slate-400 hover:text-indigo-600 transition-colors cursor-default whitespace-nowrap tracking-tight">
                {uni}
              </h3>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. HOW IT WORKS ================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 relative w-full">
        <div className="text-center mb-12 sm:mb-20 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 tracking-tight">How the Platform Works</h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-medium px-4">A seamless journey from scanning your raw classroom notes to acing your final exams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
          <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-10 rounded-3xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <DocumentArrowUpIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-800 tracking-tight">1. Digitize & Organize</h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">Create your account and setup your semester. Snap pictures of your written notes or upload PDFs sequentially. Keep your timetables all in one place.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-10 rounded-3xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <ChartBarIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-800 tracking-tight">2. Track Your Averages</h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">Input marks for CATs and assignments. Set your unit distributions (e.g., Labs=15, CATs=10, Exams=70). Calculate your standing before the main exam.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-10 rounded-3xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-800 tracking-tight">3. AI-Powered Analysis</h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">Our AI reads your uploaded notes to generate summaries and examinable Q&A. Take AI quizzes to pinpoint weak areas and get curated YouTube remedies.</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 sm:p-10 rounded-3xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <FireIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-800 tracking-tight">4. Build Learning Streaks</h3>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">Keep your flame alive by checking in every 7 days per unit. Earn streaks by uploading scanned notes, taking AI quizzes, or reading weekly summaries.</p>
          </div>
        </div>
      </section>

      {/* ================= 5. WHAT YOU CAN ACHIEVE ================= */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 grid lg:grid-cols-2 gap-12 sm:gap-20 items-center relative w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-slate-100 rounded-full blur-3xl -z-10 opacity-50"></div>
        
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 sm:mb-12 tracking-tight leading-tight">What you can achieve with our platform</h2>
          <div className="space-y-8 sm:space-y-10">
            <div className="flex gap-4 sm:gap-5 group">
              <div className="flex-shrink-0 mt-1"><CheckBadgeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500 group-hover:scale-110 transition-transform"/></div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Custom Grading Schemas</h4>
                <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium leading-relaxed">Key in global distributions for all units, but edit specific subjects if their grading differs.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-5 group">
              <div className="flex-shrink-0 mt-1"><PresentationChartLineIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 group-hover:scale-110 transition-transform"/></div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Visual Progress Analytics</h4>
                <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium leading-relaxed">Know exactly what you need in your main exam based on your CAT and assignment averages.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-5 group">
              <div className="flex-shrink-0 mt-1"><BookOpenIcon className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 group-hover:scale-110 transition-transform"/></div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Progressive Past Papers</h4>
                <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium leading-relaxed">Share past papers with course mates. The AI answers them based on what you have learned up to that week.</p>
              </div>
            </div>
            <div className="flex gap-4 sm:gap-5 group">
              <div className="flex-shrink-0 mt-1"><VideoCameraIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 group-hover:scale-110 transition-transform"/></div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Smart Remedial Solutions</h4>
                <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium leading-relaxed">Failed a quiz? The AI pinpoints the exact sub-topic weakness and suggests relevant YouTube materials.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES SLIDER */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-tr from-slate-100 to-blue-50/50 rounded-3xl sm:rounded-[2.5rem] border-4 sm:border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden">
          {featureImages.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`Feature Slide ${idx + 1}`}
              fill
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                idx === featureSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))}
          
          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {featureImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFeatureSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                  idx === featureSlide ? 'bg-blue-600 w-6' : 'bg-white border border-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. FAQ SECTION ================= */}
      <section id="faq" className="py-20 sm:py-32 relative w-full">
        <div className="absolute inset-0 bg-slate-900 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] -z-10"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-12 sm:mb-16 text-white tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4">
            
            <details className="bg-slate-800/50 backdrop-blur-md p-5 sm:p-7 rounded-2xl border border-slate-700/50 cursor-pointer group hover:bg-slate-800 transition-colors">
              <summary className="font-bold text-lg sm:text-xl list-none flex justify-between items-center text-slate-100">
                Is this platform suitable for TVETs and Colleges?
                <span className="transition-transform group-open:rotate-180 text-emerald-400 bg-emerald-400/10 p-2 rounded-full flex items-center justify-center ml-2 flex-shrink-0">▼</span>
              </summary>
              <p className="text-slate-400 text-sm sm:text-base mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-700/50 leading-relaxed">Yes! The platform is highly customizable. Whether you are doing a 4-year degree or a diploma at a TVET, you can customize your units, semesters, and grading scales to fit your specific curriculum.</p>
            </details>

            <details className="bg-slate-800/50 backdrop-blur-md p-5 sm:p-7 rounded-2xl border border-slate-700/50 cursor-pointer group hover:bg-slate-800 transition-colors">
              <summary className="font-bold text-lg sm:text-xl list-none flex justify-between items-center text-slate-100">
                How does the AI read my handwritten notes?
                <span className="transition-transform group-open:rotate-180 text-emerald-400 bg-emerald-400/10 p-2 rounded-full flex items-center justify-center ml-2 flex-shrink-0">▼</span>
              </summary>
              <p className="text-slate-400 text-sm sm:text-base mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-700/50 leading-relaxed">You simply take a clear picture of your notes. Our system uses advanced OCR (Optical Character Recognition) to convert the image into text, allowing the AI to generate summaries, revision questions, and quizzes.</p>
            </details>

            <details className="bg-slate-800/50 backdrop-blur-md p-5 sm:p-7 rounded-2xl border border-slate-700/50 cursor-pointer group hover:bg-slate-800 transition-colors">
              <summary className="font-bold text-lg sm:text-xl list-none flex justify-between items-center text-slate-100">
                How do the streaks work?
                <span className="transition-transform group-open:rotate-180 text-emerald-400 bg-emerald-400/10 p-2 rounded-full flex items-center justify-center ml-2 flex-shrink-0">▼</span>
              </summary>
              <p className="text-slate-400 text-sm sm:text-base mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-700/50 leading-relaxed">Every unit has its own streak that resets every 7 days. To keep your flame alive, you must engage with the unit by either uploading new scanned notes, taking an AI quiz, or reading the weekly AI summary.</p>
            </details>

            <details className="bg-slate-800/50 backdrop-blur-md p-5 sm:p-7 rounded-2xl border border-slate-700/50 cursor-pointer group hover:bg-slate-800 transition-colors">
              <summary className="font-bold text-lg sm:text-xl list-none flex justify-between items-center text-slate-100">
                Will there be a mobile app?
                <span className="transition-transform group-open:rotate-180 text-emerald-400 bg-emerald-400/10 p-2 rounded-full flex items-center justify-center ml-2 flex-shrink-0">▼</span>
              </summary>
              <p className="text-slate-400 text-sm sm:text-base mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-700/50 leading-relaxed">Currently, Phase 1 is a web-based portal that is highly optimized for mobile browsers. In Phase 3, we plan to release a dedicated Android app on the Google Play Store, alongside features for educators to monitor progress.</p>
            </details>

          </div>
        </div>
      </section>

      {/* ================= 7. FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-300 py-16 sm:py-20 border-t border-slate-800 relative overflow-hidden w-full">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12 relative z-10">
          
          <div className="md:col-span-2"> 
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://res.cloudinary.com/dnipaby6h/image/upload/v1771694201/samples/radial.avif" 
                alt="StudyPlatform Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shadow-lg ring-1 ring-white/10"
              />
              <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">StudyPlatform AI</span>
            </div>
            <p className="text-slate-400 text-sm sm:text-base max-w-sm mb-6 sm:mb-8 leading-relaxed">
              Empowering university students through technology. Manage your academics, utilize AI to master complex units, and maintain your streaks to achieve top grades.
            </p>
            <div className="space-y-2 text-slate-400 text-sm sm:text-base font-medium">
              <p>Email: <a href="mailto:hello@studyplatform.co.ke" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">hello@studyplatform.co.ke</a></p>
              <p>Nairobi, Kenya</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6 tracking-tight">Platform</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base font-medium">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</Link></li>
              <li><Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link></li>
              <li><Link href="/login" className="text-white hover:text-emerald-400 transition-colors">Student Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6 tracking-tight">Connect With Us</h4>
            <ul className="space-y-4 sm:space-y-5 text-sm sm:text-base font-medium mb-6 sm:mb-8">
              <li>
                <a href="#" className="flex items-center gap-3 hover:text-emerald-400 transition-colors group">
                  <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-emerald-400/10 transition-colors">
                    <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  @StudyPlatform_KE
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 hover:text-emerald-400 transition-colors group">
                  <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-emerald-400/10 transition-colors">
                    <svg className="w-4 h-4 fill-current text-slate-400 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.16-3.44-3.37-3.46-5.7-.02-1.29.3-2.58.95-3.71A5.987 5.987 0 0 1 7.42 8.96c1.23-.42 2.58-.51 3.86-.28v4.06c-.46-.11-.94-.14-1.41-.07-.76.1-1.49.53-1.95 1.14-.38.49-.57 1.1-.53 1.71.04.66.33 1.28.82 1.74.59.54 1.42.76 2.21.6.86-.17 1.6-.74 1.96-1.53.18-.41.25-.86.26-1.31.02-4.99.01-9.98.01-14.97z"/></svg>
                  </div>
                  @study_platform
                </a>
              </li>
            </ul>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-500">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16 pt-8 border-t border-slate-800/50 text-center text-xs sm:text-sm font-medium text-slate-600">
          © {new Date().getFullYear()} AI Study Platform Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}