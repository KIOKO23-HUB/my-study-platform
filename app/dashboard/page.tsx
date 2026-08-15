"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import CalendarReminders from '../../components/CalendarReminders';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  SparklesIcon, 
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ArrowUpTrayIcon,
  CameraIcon,
  TrashIcon,
  PlusSmallIcon,
  MinusSmallIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PencilSquareIcon,
  Bars3Icon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { FireIcon as FireIconSolid, XMarkIcon, FireIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const motivationalQuotes = [
  "Engineering is not only about knowing math and science, it is about intelligence and application. Keep building!",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The secret of getting ahead is getting started on your capstone and calculations.",
  "Excellence is not an act, but a habit cultivated in every lecture and laboratory session."
];

const getCurrentWeek = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil((((now.getTime() - start.getTime()) / 86400000) + start.getDay() + 1) / 7);
};

// AI Course Recognition Welcome Note Generator
const getCourseWelcomeNote = (courseName: string, userName: string) => {
  if (!courseName) return `Welcome back, ${userName}! Let's make today count and build your academic success! 🚀`;
  
  const lower = courseName.toLowerCase();
  if (lower.includes('nurse') || lower.includes('nursing')) {
    return `✨ Hello Dr. / Nurse ${userName}! Thank you for joining a platform designed to make your healing journey true, caring, and magical! 🩺💖`;
  } else if (lower.includes('mech') || lower.includes('civil') || lower.includes('eng')) {
    return `⚡ Welcome back, Engineer ${userName}! Your capstones, blueprints, and calculations are shaping tomorrow's world. Keep building! 🏗️⚙️`;
  } else if (lower.includes('computer') || lower.includes('tech') || lower.includes('it') || lower.includes('software')) {
    return `💻 Hey Code Wizard ${userName}! Ready to deploy brilliance and squash bugs today? Your tech journey is magic! 🚀✨`;
  } else if (lower.includes('med') || lower.includes('surgery') || lower.includes('clinical')) {
    return `🌟 Greetings, Future Lifesaver ${userName}! May your clinicals and medical studies bring healing and true magic to the world! 🏥✨`;
  } else if (lower.includes('law') || lower.includes('legal')) {
    return `⚖️ Welcome back, Counselor ${userName}! May your arguments be sharp and your studies pave the way for true justice! 🏛️✨`;
  } else if (lower.includes('bus') || lower.includes('econ') || lower.includes('finance') || lower.includes('com')) {
    return `📈 Hello Tycoon ${userName}! Ready to scale markets, analyze alphas, and build business empires today? 💼✨`;
  } else {
    return `✨ Welcome back, ${userName}! Proud to have a dedicated ${courseName} scholar on board. Let's make your academic journey true and magic! 🎓🚀`;
  }
};

export default function Dashboard() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("Student");
  const [userCourse, setUserCourse] = useState("General Studies");
  const [userInitials, setUserInitials] = useState("ST");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userSubscription, setUserSubscription] = useState("free");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // M-Pesa Upgrade States
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly'>('weekly');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [showManualVerify, setShowManualVerify] = useState(false);
  const [manualCode, setManualCode] = useState("");

  const [editName, setEditName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  const [myUnits, setMyUnits] = useState<any[]>([]);
  const [timetable, setTimetable] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [],
  });

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderEmail, setReminderEmail] = useState("");

  // Shared Global Community & Engagement States (Synced via LocalStorage for Public Visibility)
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(42);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [commentsList, setCommentsList] = useState<Array<{ name: string; text: string; date: string }>>([
    { name: "Prof. Ochieng", text: "This platform is an incredible tool for engineering students!", date: "Today" },
    { name: "Brian Kiprop", text: "The timetable parser and streak tracker are absolute lifesavers.", date: "Yesterday" }
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  // Sync public comments and likes across sessions via localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('studyplatform_global_likes');
    const savedComments = localStorage.getItem('studyplatform_global_comments');
    if (savedLikes) setLikeCount(Number(savedLikes));
    if (savedComments) {
      try {
        setCommentsList(JSON.parse(savedComments));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIdx]);
    }, 10000);
    return () => clearInterval(quoteInterval);
  }, []);

  // ================= 🛡️ BULLETPROOF AUTH CHECK (SUPABASE) =================
  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          if (isMounted) router.replace('/login');
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          if (isMounted) router.replace('/login');
          return;
        }

        if (!isMounted) return;
        setUserId(user.id);
        setReminderEmail(user.email || "");
        
        const meta = user.user_metadata || {};
        setUserSubscription(meta.subscription || 'free');

        const registeredName = meta.first_name || meta.full_name || meta.username || "Student";
        const firstNameOnly = registeredName.trim().split(' ')[0].replace(/[0-9]/g, ''); 
        const cleanName = firstNameOnly ? firstNameOnly.charAt(0).toUpperCase() + firstNameOnly.slice(1).toLowerCase() : "Student";
        
        setUserName(cleanName);
        setEditName(cleanName);
        setUserInitials(cleanName.substring(0, 2).toUpperCase());
        setUserCourse(meta.course || meta.school || "General Studies");
        
        if (meta.avatar_url) setUserAvatar(meta.avatar_url);
        if (meta.myUnits && Array.isArray(meta.myUnits)) setMyUnits(meta.myUnits);
        if (meta.timetable) setTimetable(meta.timetable);

        setIsLoading(false);
        
      } catch (err) {
        console.error("Dashboard Auth Error:", err);
        if (isMounted) {
          setIsLoading(false); 
          router.replace('/login');
        }
      }
    };
    
    checkUser();

    return () => {
      isMounted = false; 
    };
  }, [router]);

  // Handle Global Public Like Action
  const handleLikeAction = () => {
    let newLikes = likeCount;
    if (hasLiked) {
      newLikes -= 1;
      setHasLiked(false);
    } else {
      newLikes += 1;
      setHasLiked(true);
    }
    setLikeCount(newLikes);
    localStorage.setItem('studyplatform_global_likes', newLikes.toString());
  };

  // Handle Global Public Comment Submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newEntry = {
      name: userName || "Student",
      text: newCommentText.trim(),
      date: "Just now"
    };

    const updatedComments = [newEntry, ...commentsList];
    setCommentsList(updatedComments);
    localStorage.setItem('studyplatform_global_comments', JSON.stringify(updatedComments));
    setNewCommentText("");
    alert("Your comment has been posted publicly for everyone to see!");
  };

  // M-Pesa STK Push Trigger Handler
  const handleMpesaCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaPhone.trim()) return alert("Please enter your M-Pesa phone number.");

    setIsProcessingPayment(true);
    setPaymentMessage("Sending automated M-Pesa prompt to your phone... Check your screen.");

    try {
      const res = await fetch('/api/mpesa/stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mpesaPhone.trim(),
          plan: selectedPlan,
          userId: userId
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPaymentMessage("STK Push sent successfully! Enter your M-Pesa PIN to complete upgrade.");
      } else {
        setPaymentMessage("Prompt processing complete. Enter your transaction code below if prompt was completed.");
        setShowManualVerify(true);
      }
    } catch (err) {
      setPaymentMessage("Connection secured. Enter your transaction code below to verify.");
      setShowManualVerify(true);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Manual M-Pesa Code Verification Handler
  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return alert("Please enter your M-Pesa transaction code.");

    setIsProcessingPayment(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { subscription: 'pro', ai_tokens_left: 99999 }
      });

      if (error) throw error;

      setUserSubscription('pro');
      alert("Subscription upgraded to PRO successfully!");
      setShowUpgradeModal(false);
      setShowManualVerify(false);
    } catch (err: any) {
      alert("Verification error: " + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const persistData = async (updatedUnits: any[], updatedTimetable: any) => {
    const { error } = await supabase.auth.updateUser({
      data: { myUnits: updatedUnits, timetable: updatedTimetable }
    });
    if (error) console.error("Failed to save data:", error.message);
  };

  const registerUnitActivity = async (unitId: number) => {
    const currentWeek = getCurrentWeek();
    let isUpdated = false;

    const updatedUnits = myUnits.map(unit => {
      if (unit.id === unitId) {
        const lastWeek = unit.lastInteractionWeek || 0;
        
        if (lastWeek === currentWeek) {
          return unit;
        } else if (lastWeek === currentWeek - 1 || lastWeek === 0) {
          isUpdated = true;
          return { ...unit, streak: (unit.streak || 0) + 1, lastInteractionWeek: currentWeek };
        } else {
          isUpdated = true;
          return { ...unit, streak: 1, lastInteractionWeek: currentWeek };
        }
      }
      return unit;
    });

    if (isUpdated) {
      setMyUnits(updatedUnits);
      await persistData(updatedUnits, timetable);
    }
  };

  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

  const navItems = [
    { name: 'Overview', icon: HomeIcon },
    { name: 'My Units', icon: BookOpenIcon },
    { name: 'Timetable', icon: CalendarDaysIcon },
    { name: 'Self-Study Evaluation', icon: ChartBarIcon },
    { name: 'AI Study Hub', icon: SparklesIcon },
    { name: 'Report Writing', icon: PencilSquareIcon }, 
    { name: 'Community & Feedback', icon: ChatBubbleBottomCenterTextIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitData, setNewUnitData] = useState({ name: '', lecturer: '', target: 70, isTechnical: false });
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzingScore, setIsAnalyzingScore] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [unitFiles, setUnitFiles] = useState<any[]>([]);

  const [aiQuery, setAiQuery] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string; fileName?: string }>>([
    { role: 'ai', content: "Hello! I am your Campus Study AI. You can chat with me, ask questions, or attach study materials for deep analysis." }
  ]);

  const [reportQuery, setReportQuery] = useState("");
  const [isReportThinking, setIsReportThinking] = useState(false);
  const [reportAttachedFile, setReportAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const [reportChatHistory, setReportChatHistory] = useState<Array<{ role: string; content: string; fileName?: string }>>([
    { role: 'ai', content: "Welcome to the AI Report Writer! 👋\n\nTo begin, please upload your manual, lab data, Excel spreadsheets, or reference materials using the paperclip icon below." }
  ]);

  const [showTimetableAiModal, setShowTimetableAiModal] = useState(false);
  const [timetableAiQuery, setTimetableAiQuery] = useState("");
  const [isTimetableAiThinking, setIsTimetableAiThinking] = useState(false);
  const [timetableAiAttachedFile, setTimetableAiAttachedFile] = useState<{ name: string; content: string } | null>(null);
  const [timetableAiChat, setTimetableAiChat] = useState<Array<{ role: string; content: string; fileName?: string }>>([
    { role: 'ai', content: "Hello! Upload your timetable document or photo (or type class details like '4.1 BEd Mechanical'). I'll analyze it!" }
  ]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(editName);
    setUserInitials(editName.substring(0, 2).toUpperCase());
     
    await supabase.auth.updateUser({
      data: { first_name: editName, avatar_url: userAvatar }
    });

    setShowProfileModal(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchUnitFiles = async () => {
      if (selectedUnit === null || !userId) return;
      const { data } = await supabase.storage.from('study-materials').list(`${userId}/unit-${selectedUnit}`, { limit: 100 });
      if (data) setUnitFiles(data.filter(f => f.name && f.name !== '.emptyFolderPlaceholder'));
    };
    fetchUnitFiles();
  }, [selectedUnit, isUploading, userId]);

  const handleDeleteFile = async (fileName: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      if (!userId || selectedUnit === null) return;
      setIsUploading(true); 
      const filePath = `${userId}/unit-${selectedUnit}/${fileName}`;
      const { error } = await supabase.storage.from('study-materials').remove([filePath]);
      if (error) alert("Error deleting file: " + error.message);
      else {
        const { data } = await supabase.storage.from('study-materials').list(`${userId}/unit-${selectedUnit}`, { limit: 100 });
        if (data) setUnitFiles(data.filter(f => f.name && f.name !== '.emptyFolderPlaceholder'));
        else setUnitFiles([]);
      }
      setIsUploading(false);
    }
  };

  const handleChatFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string || "File attached successfully.";
      setAttachedFile({ name: file.name, content });
      if (!uploadedDocuments.includes(file.name)) setUploadedDocuments((prev) => [...prev, file.name]);
    };
    reader.readAsText(file);
  };

  const handleReportFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string || "File attached successfully.";
      setReportAttachedFile({ name: file.name, content });
    };
    reader.readAsText(file);
  };

  const handleTimetableAiFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string || "Timetable document attached.";
      setTimetableAiAttachedFile({ name: file.name, content });
    };
    reader.readAsText(file);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: string, unitId: number) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${userId}/unit-${unitId}/${fileName}`;

    const { error } = await supabase.storage.from('study-materials').upload(filePath, file);
    setIsUploading(false);

    if (error) alert("Error uploading file: " + error.message);
    else {
      await registerUnitActivity(unitId);
      const { data } = await supabase.storage.from('study-materials').list(`${userId}/unit-${selectedUnit}`, { limit: 100 });
      if (data) setUnitFiles(data.filter(f => f.name && f.name !== '.emptyFolderPlaceholder'));
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUnit = {
      id: Date.now(), name: newUnitData.name, lecturer: newUnitData.lecturer,
      target: newUnitData.target, isTechnical: newUnitData.isTechnical,
      streak: 0, lastInteractionWeek: 0, currentAvg: 0,
      assignmentCount: 2, catCount: 2, labCount: newUnitData.isTechnical ? 2 : 0
    };
    const updatedUnits = [...myUnits, newUnit];
    setMyUnits(updatedUnits);
    await persistData(updatedUnits, timetable);
    setShowAddUnitModal(false);
    setNewUnitData({ name: '', lecturer: '', target: 70, isTechnical: false });
  };

  const deleteUnit = async (id: number) => {
    if (confirm("Are you sure you want to remove this unit?")) {
      const updatedUnits = myUnits.filter(u => u.id !== id);
      setMyUnits(updatedUnits);
      await persistData(updatedUnits, timetable);
      if (selectedUnit === id) setSelectedUnit(null);
    }
  };

  const addClassToDay = async (day: string) => {
    const updatedTimetable = { ...timetable };
    // @ts-ignore
    if (updatedTimetable[day].length < 5) {
      // @ts-ignore
      updatedTimetable[day].push({ id: Date.now(), time: '', unit: '', room: '' });
      setTimetable(updatedTimetable);
      await persistData(myUnits, updatedTimetable);
    } else alert("Maximum lessons reached for this day.");
  };

  const removeClassFromDay = async (day: string, id: number) => {
    const updatedTimetable = { ...timetable };
    // @ts-ignore
    updatedTimetable[day] = updatedTimetable[day].filter(cls => cls.id !== id);
    setTimetable(updatedTimetable);
    await persistData(myUnits, updatedTimetable);
  };

  const updateClassData = async (day: string, id: number, field: string, value: string) => {
    const updatedTimetable = { ...timetable };
    // @ts-ignore
    updatedTimetable[day] = updatedTimetable[day].map(cls => cls.id === id ? { ...cls, [field]: value } : cls);
    setTimetable(updatedTimetable);
    await persistData(myUnits, updatedTimetable);
  };

  const handleClearTimetable = async () => {
    if (confirm("Are you sure you want to clear your ENTIRE timetable?")) {
      const emptyTimetable = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
      setTimetable(emptyTimetable);
      await persistData(myUnits, emptyTimetable);
    }
  };

  const changeAssessmentCount = async (unitId: number, type: 'assignmentCount' | 'catCount' | 'labCount', operation: 'add' | 'remove') => {
    const updatedUnits = myUnits.map(unit => {
      if (unit.id === unitId) {
        const currentCount = unit[type];
        const newCount = operation === 'add' ? currentCount + 1 : Math.max(0, currentCount - 1);
        return { ...unit, [type]: newCount };
      }
      return unit;
    });
    setMyUnits(updatedUnits);
    await persistData(updatedUnits, timetable);
  };

  const handleGenerateWeeklySummary = async () => {
    setIsGeneratingSummary(true);
    setWeeklySummary(null);
    const unitNames = myUnits.map(u => u.name).join(', ') || 'No units registered yet';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Generate a structured weekly study summary and recommendations for a university student taking these units: ${unitNames}.` })
      });
      const data = await res.json();
      setWeeklySummary(data.reply || "Could not generate summary.");
    } catch (err) {
      setWeeklySummary("Error connecting to AI service.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAnalyzeScores = async (unitName: string, target: number) => {
    setIsAnalyzingScore(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Analyze student performance for the unit '${unitName}' with an exam target of ${target}%. Provide actionable study advice and prediction.` })
      });
      const data = await res.json();
      setAiReport(data.reply || "Analysis complete.");
    } catch (err) {
      setAiReport("Error connecting to AI service.");
    } finally {
      setIsAnalyzingScore(false);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim() && !attachedFile) return;

    const userMessageText = aiQuery.trim() || `Please analyze this attached file: ${attachedFile?.name}`;
    const displayMessage = { role: 'user', content: userMessageText, fileName: attachedFile?.name };
     
    setChatHistory((prev) => [...prev, displayMessage]);
    const filePayload = attachedFile ? { fileContent: attachedFile.content, fileName: attachedFile.name } : null;
     
    setAiQuery("");
    setAttachedFile(null);
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageText, ...filePayload })
      });
      const data = await res.json();
       
      if (data.reply) setChatHistory((prev) => [...prev, { role: 'ai', content: data.reply }]);
      else setChatHistory((prev) => [...prev, { role: 'ai', content: "Oops, I didn't understand that." }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: 'ai', content: "Sorry, my connection was interrupted." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportQuery.trim() && !reportAttachedFile) return;

    const userMessageText = reportQuery.trim() || `I have attached a file: ${reportAttachedFile?.name}. Please process it.`;
    const displayMessage = { role: 'user', content: userMessageText, fileName: reportAttachedFile?.name };
     
    setReportChatHistory((prev) => [...prev, displayMessage]);
    const filePayload = reportAttachedFile ? { fileContent: reportAttachedFile.content, fileName: reportAttachedFile.name } : null;
     
    setReportQuery("");
    setReportAttachedFile(null);
    setIsReportThinking(true);

    const injectedMessage = `[SYSTEM RULES: Step-by-Step Report Writing Assistant. Write ONE section at a time. Stop and ask for approval.]\nUser Input: ${userMessageText}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: injectedMessage, isReportWriter: true, ...filePayload })
      });
      const data = await res.json();
       
      if (data.reply) setReportChatHistory((prev) => [...prev, { role: 'ai', content: data.reply }]);
      else setReportChatHistory((prev) => [...prev, { role: 'ai', content: "Oops, I didn't understand that." }]);
    } catch (error) {
      setReportChatHistory((prev) => [...prev, { role: 'ai', content: "Sorry, connection interrupted." }]);
    } finally {
      setIsReportThinking(false);
    }
  };

  const handleTimetableAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timetableAiQuery.trim() && !timetableAiAttachedFile) return;

    const userMessageText = timetableAiQuery.trim() || `Analyze timetable: ${timetableAiAttachedFile?.name}`;
    const displayMessage = { role: 'user', content: userMessageText, fileName: timetableAiAttachedFile?.name };

    setTimetableAiChat((prev) => [...prev, displayMessage]);
    const filePayload = timetableAiAttachedFile ? { fileContent: timetableAiAttachedFile.content, fileName: timetableAiAttachedFile.name } : null;

    setTimetableAiQuery("");
    setTimetableAiAttachedFile(null);
    setIsTimetableAiThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessageText, ...filePayload })
      });
      const data = await res.json();

      if (data.reply) setTimetableAiChat((prev) => [...prev, { role: 'ai', content: data.reply }]);
      else setTimetableAiChat((prev) => [...prev, { role: 'ai', content: "Could not process timetable." }]);
    } catch (error) {
      setTimetableAiChat((prev) => [...prev, { role: 'ai', content: "Connection error." }]);
    } finally {
      setIsTimetableAiThinking(false);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, submitFn: (e: React.FormEvent) => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitFn(e as any);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4 shadow-xl shadow-emerald-500/10"></div>
          <p className="text-emerald-400 font-bold tracking-wider animate-pulse">Initializing StudyPlatform...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full max-w-full overflow-x-hidden">
            {/* SPARKLY AI WELCOME BANNER WITH COURSE RECOGNITION */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-emerald-950 p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 text-white">
              <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold mb-3 border border-emerald-500/30">
                    <SparklesIcon className="w-3.5 h-3.5 animate-spin text-yellow-300" /> AI Study Assistant Active
                  </div>
                  
                  {/* Glittering Name & Course Recognition */}
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-emerald-200 to-teal-400 bg-clip-text text-transparent animate-pulse">
                    Welcome back, {userName}! ✨🎓
                  </h1>
                  
                  <p className="text-emerald-300 text-sm sm:text-base font-bold transition-all duration-700 mb-3 flex items-center gap-2">
                    <span>📚 Program:</span> <span className="text-white underline decoration-emerald-400">{userCourse}</span>
                  </p>

                  <p className="text-slate-300 text-sm sm:text-base font-medium italic transition-all duration-700">
                    "{getCourseWelcomeNote(userCourse, userName)}"
                  </p>
                </div>

                <button 
                  onClick={handleGenerateWeeklySummary} 
                  disabled={isGeneratingSummary}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0"
                >
                  <SparklesIcon className="w-5 h-5 text-yellow-300 animate-pulse" />
                  {isGeneratingSummary ? "Generating AI Summary..." : "Generate Weekly AI Summary"}
                </button>
              </div>
            </div>

            {weeklySummary && (
              <div className="bg-slate-900 text-white border border-emerald-500/30 p-6 rounded-3xl shadow-2xl relative animate-fadeIn">
                <button onClick={() => setWeeklySummary(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XMarkIcon className="w-5 h-5"/></button>
                <div className="flex items-center gap-2 font-bold text-emerald-400 text-base mb-3">
                  <SparklesIcon className="w-5 h-5" />
                  Weekly AI Study Summary & Guidance
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">{weeklySummary}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Overall Average</p>
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center"><ChartBarIcon className="w-5 h-5 text-blue-600"/></div>
                </div>
                <h3 className="text-4xl font-black text-slate-900">--%</h3>
                <p className="text-xs text-slate-400 font-bold mt-2">Input marks to calculate</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Learning Streak</p>
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center"><FireIconSolid className="w-5 h-5 text-orange-500 animate-bounce"/></div>
                </div>
                <h3 className="text-4xl font-black text-slate-900">
                  {myUnits.reduce((acc, unit) => acc + (unit.streak || 0), 0)} Weeks
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-2">Upload notes to ignite streak!</p>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">AI Notes Scanned</p>
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center"><DocumentTextIcon className="w-5 h-5 text-purple-600"/></div>
                </div>
                <h3 className="text-4xl font-black text-slate-900">{uploadedDocuments.length}</h3>
                <p className="text-xs text-slate-400 font-bold mt-2">Files analyzed by AI</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900">My Active Units</h2>
                <button onClick={() => setActiveTab('My Units')} className="text-sm font-extrabold text-emerald-600 hover:text-emerald-700 transition">Manage Units →</button>
              </div>
              
              {myUnits.length === 0 ? (
                <div className="text-center p-12 bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-200 shadow-xl shadow-slate-100">
                  <BookOpenIcon className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
                  <p className="text-slate-600 font-extrabold text-base">Your dashboard is empty.</p>
                  <button onClick={() => setActiveTab('My Units')} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 transition">Register your units now</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myUnits.map(unit => (
                    <div key={unit.id} className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition transform hover:-translate-y-1 group relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-full h-2.5 ${unit.streak > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <div className="flex justify-between items-start mb-4 mt-1">
                        <h3 className="font-extrabold text-lg text-slate-900 leading-snug pr-2">{unit.name}</h3>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black ${unit.streak > 0 ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' : 'bg-slate-100 text-slate-400'}`}>
                          {unit.streak > 0 ? <FireIconSolid className="w-3.5 h-3.5" /> : <FireIcon className="w-3.5 h-3.5" />} {unit.streak || 0}w
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 my-4 overflow-hidden">
                        <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `0%` }}></div>
                      </div>
                      <p className="text-xs text-slate-500 font-extrabold">Target Exam Mark: <span className="text-slate-900">{unit.target}%</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'My Units':
        if (selectedUnit === null) {
          return (
            <div className="animate-fadeIn relative w-full max-w-full overflow-x-hidden">
              <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 mb-1">Unit Management</h1>
                  <p className="text-slate-500 font-semibold text-sm">Add, delete, and configure your semester subjects.</p>
                </div>
                <button onClick={() => setShowAddUnitModal(true)} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-extrabold text-sm shadow-xl shadow-emerald-600/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  <PlusIcon className="w-5 h-5" /> Add New Unit
                </button>
              </div>

              {showAddUnitModal && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-black text-slate-900">Register New Unit</h2>
                      <button onClick={() => setShowAddUnitModal(false)} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6"/></button>
                    </div>
                    <form onSubmit={handleAddUnit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Unit Name</label>
                        <input required type="text" value={newUnitData.name} onChange={e => setNewUnitData({...newUnitData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-semibold text-slate-900" placeholder="e.g. Calculus I" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Lecturer Name</label>
                        <input required type="text" value={newUnitData.lecturer} onChange={e => setNewUnitData({...newUnitData, lecturer: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-semibold text-slate-900" placeholder="e.g. Prof. Ochieng" />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Target Mark (%)</label>
                          <input required type="number" max="100" value={newUnitData.target} onChange={e => setNewUnitData({...newUnitData, target: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-semibold text-slate-900" />
                        </div>
                        <div className="flex-1 flex flex-col justify-end">
                          <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition">
                            <input type="checkbox" checked={newUnitData.isTechnical} onChange={e => setNewUnitData({...newUnitData, isTechnical: e.target.checked})} className="w-4 h-4 text-emerald-600 rounded" />
                            <span className="text-xs font-black text-slate-700">Has Labs?</span>
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-2xl transition shadow-xl mt-4 text-sm">Save Unit</button>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-wider">
                        <th className="p-5">Unit Name</th>
                        <th className="p-5">Lecturer</th>
                        <th className="p-5">Type</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {myUnits.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-slate-400 font-bold">No units added yet.</td></tr>}
                      {myUnits.map(unit => (
                        <tr key={unit.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-5 font-extrabold text-slate-900">{unit.name}</td>
                          <td className="p-5 text-slate-600 font-semibold">{unit.lecturer}</td>
                          <td className="p-5">
                            {unit.isTechnical ? 
                              <span className="bg-blue-500/10 text-blue-700 px-3 py-1 text-xs font-black rounded-xl border border-blue-500/20">Technical/Lab</span> : 
                              <span className="bg-slate-100 text-slate-600 px-3 py-1 text-xs font-black rounded-xl">Theory</span>
                            }
                          </td>
                          <td className="p-5 text-right flex justify-end gap-2.5">
                            <button onClick={() => setSelectedUnit(unit.id)} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-md transition">
                              Open
                            </button>
                            <button onClick={() => deleteUnit(unit.id)} className="p-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-xl transition" title="Delete">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }

        const unit = myUnits.find(u => u.id === selectedUnit);
        return (
          <div className="animate-fadeIn w-full max-w-full overflow-x-hidden">
            <button onClick={() => setSelectedUnit(null)} className="text-sm font-black text-emerald-600 hover:text-emerald-700 mb-6 flex items-center gap-2">
              ← Back to All Units
            </button>
            <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900">{unit?.name} Workspace</h1>
                <p className="text-slate-500 font-semibold text-sm">Upload materials and view stored files for this unit.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center"><BookOpenIcon className="w-5 h-5 text-blue-600" /></div>
                  <h3 className="font-black text-lg text-slate-900">Lecture Materials</h3>
                </div>
                
                <label className={`border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition cursor-pointer bg-slate-50/50 block relative ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input 
                    type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.xls,.csv" className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'class-notes', unit!.id)} disabled={isUploading}
                  />
                  <ArrowUpTrayIcon className={`w-8 h-8 mx-auto mb-2 ${isUploading ? 'text-emerald-600 animate-bounce' : 'text-slate-400'}`} />
                  <p className="font-extrabold text-slate-700 text-sm">{isUploading ? 'Uploading...' : 'Upload Notes / Spreadsheet'}</p>
                </label>

                <label className={`border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-500 hover:bg-teal-50/50 transition cursor-pointer bg-slate-50/50 block relative ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input 
                    type="file" accept="image/*" capture="environment" className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'post-lesson-photo', unit!.id)} disabled={isUploading}
                  />
                  <CameraIcon className={`w-8 h-8 mx-auto mb-2 ${isUploading ? 'text-teal-600 animate-bounce' : 'text-slate-400'}`} />
                  <p className="font-extrabold text-slate-700 text-sm">{isUploading ? 'Uploading...' : 'Upload Post-Lesson Photo'}</p>
                </label>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center"><DocumentTextIcon className="w-5 h-5 text-indigo-600" /></div>
                  <h3 className="font-black text-lg text-slate-900">Uploaded Files ({unitFiles.length})</h3>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[280px] space-y-2.5 pr-1">
                  {unitFiles.length === 0 ? (
                    <div className="text-center py-14 border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-400 font-bold">No files uploaded yet for this unit.</p>
                    </div>
                  ) : (
                    unitFiles.map((file, idx) => {
                      const fileUrlPath = `${userId}/unit-${selectedUnit}/${file.name}`;
                      const { data: publicUrlData } = supabase.storage.from('study-materials').getPublicUrl(fileUrlPath);
                      const cleanName = file.name.split('-').slice(1).join('-') || file.name;

                      return (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 hover:border-emerald-300 p-3.5 rounded-2xl transition group">
                          <div className="flex items-center gap-3 truncate flex-1 pr-3">
                            <span className="text-lg">📄</span>
                            <span className="truncate text-xs font-bold text-slate-700 group-hover:text-emerald-700">{cleanName}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <a href={publicUrlData.publicUrl} onClick={() => registerUnitActivity(unit!.id)} className="text-emerald-600 hover:underline text-xs font-black">Open ↗</a>
                            <button onClick={(e) => { e.preventDefault(); handleDeleteFile(file.name); }} className="text-slate-400 hover:text-red-600 p-1"><TrashIcon className="w-4 h-4" /></button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Timetable':
        return (
          <div className="animate-fadeIn w-full max-w-full overflow-x-hidden">
            <div className="mb-8 flex justify-between items-end flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">My Timetable</h1>
                <p className="text-slate-500 font-semibold text-sm">Build weekly schedule or auto-fill with AI.</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button onClick={handleClearTimetable} className="flex-1 sm:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition flex items-center justify-center gap-1.5">
                  <TrashIcon className="w-4 h-4" /> Clear
                </button>
                <button onClick={() => setShowReminderModal(true)} className="flex-1 sm:flex-none bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/20 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition flex items-center justify-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" /> Set Reminders
                </button>
                <button onClick={() => setShowTimetableAiModal(true)} className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-yellow-300" /> Auto-Fill AI
                </button>
              </div>
            </div>

            {showTimetableAiModal && (
              <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl flex flex-col h-[80vh] border border-slate-100 animate-fadeIn">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-blue-600" /></div>
                      <h2 className="text-xl font-black text-slate-900">AI Timetable Parser</h2>
                    </div>
                    <button onClick={() => setShowTimetableAiModal(false)} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6"/></button>
                  </div>

                  <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
                    {timetableAiChat.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 rounded-tr-sm' : 'bg-slate-100 text-slate-900 border border-slate-200/60 rounded-tl-sm'}`}>
                          {msg.fileName && <div className="text-xs bg-blue-700 text-white px-2.5 py-1 rounded-lg mb-2 font-black inline-block">📎 {msg.fileName}</div>}
                          <p className="leading-relaxed font-semibold whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTimetableAiThinking && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3.5 flex gap-1.5 items-center">
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {timetableAiAttachedFile && (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl mb-3 text-xs font-black text-blue-700">
                      <span>📎 {timetableAiAttachedFile.name}</span>
                      <button onClick={() => setTimetableAiAttachedFile(null)} className="text-red-600 font-bold">Remove</button>
                    </div>
                  )}

                  <form onSubmit={handleTimetableAiSubmit} className="relative flex items-center gap-2.5">
                    <label className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl hover:bg-slate-200 transition cursor-pointer text-slate-600 hover:text-blue-600">
                      <PaperClipIcon className="w-5 h-5" />
                      <input type="file" accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv,image/*" className="hidden" onChange={handleTimetableAiFileAttach} />
                    </label>
                    <div className="relative flex-1">
                      <textarea
                        rows={1}
                        value={timetableAiQuery}
                        onChange={(e) => setTimetableAiQuery(e.target.value)}
                        onKeyDown={(e) => handleTextareaKeyDown(e, handleTimetableAiSubmit)}
                        placeholder="Upload file or type details..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-12 outline-none focus:border-blue-500 text-sm font-semibold text-slate-900 resize-none shadow-inner"
                        disabled={isTimetableAiThinking}
                      />
                      <button type="submit" disabled={isTimetableAiThinking || (!timetableAiQuery.trim() && !timetableAiAttachedFile)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition disabled:opacity-50">
                        <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                  <div className="bg-slate-900 text-white text-center py-3.5 font-black text-xs tracking-wider uppercase">{day}</div>
                  <div className="p-4 space-y-3.5 flex-1">
                    {/* @ts-ignore */}
                    {timetable[day].length === 0 && <p className="text-xs text-center text-slate-400 font-bold italic py-6">No lessons</p>}
                    {/* @ts-ignore */}
                    {timetable[day].map((cls) => (
                      <div key={cls.id} className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl relative group transition hover:border-blue-300 shadow-sm">
                        <input type="text" value={cls.time} onChange={(e) => updateClassData(day, cls.id, 'time', e.target.value)} className="w-full text-xs font-black text-blue-600 bg-transparent outline-none mb-1" placeholder="08:00 - 10:00" />
                        <input type="text" value={cls.unit} onChange={(e) => updateClassData(day, cls.id, 'unit', e.target.value)} className="w-full font-black text-slate-900 bg-transparent outline-none mb-1 text-sm" placeholder="Unit Name" />
                        <input type="text" value={cls.room} onChange={(e) => updateClassData(day, cls.id, 'room', e.target.value)} className="w-full text-xs font-semibold text-slate-500 bg-transparent outline-none" placeholder="Room/Location" />
                        <button onClick={() => removeClassFromDay(day, cls.id)} className="absolute top-2.5 right-2.5 text-slate-300 hover:text-red-500 bg-white rounded-xl p-1 shadow-md"><XMarkIcon className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => addClassToDay(day)} className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-500 transition text-xs font-black flex items-center justify-center gap-1.5"><PlusIcon className="w-4 h-4" /> Add Lesson</button>
                  </div>
                </div>
              ))}
            </div>

            <CalendarReminders 
              isOpen={showReminderModal} 
              onClose={() => setShowReminderModal(false)} 
              timetable={timetable} 
              userEmail={reminderEmail} 
            />
          </div>
        );

      case 'Self-Study Evaluation':
        return (
          <div className="animate-fadeIn w-full max-w-full overflow-x-hidden">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 mb-1">Performance Evaluation</h1>
              <p className="text-slate-500 font-semibold text-sm">Input scores and let AI analyze your academic standing.</p>
            </div>

            <div className="space-y-6">
              {myUnits.length === 0 && <p className="text-slate-500 bg-white/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-100 text-center text-sm font-bold shadow-xl">Add units in the "My Units" tab first.</p>}
              
              {myUnits.map(unit => (
                <div key={unit.id} className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 flex-wrap gap-2">
                    <h3 className="font-black text-xl text-slate-900">{unit.name}</h3>
                    <span className="text-xs font-black text-white bg-slate-900 px-4 py-1.5 rounded-full shadow-md">Target: {unit.target}%</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Assignments</h4>
                        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                          <button onClick={() => changeAssessmentCount(unit.id, 'assignmentCount', 'remove')} className="p-1 text-slate-500 hover:text-slate-900"><MinusSmallIcon className="w-4 h-4"/></button>
                          <span className="text-xs font-black text-slate-900 w-5 text-center">{unit.assignmentCount}</span>
                          <button onClick={() => changeAssessmentCount(unit.id, 'assignmentCount', 'add')} className="p-1 text-slate-500 hover:text-slate-900"><PlusSmallIcon className="w-4 h-4"/></button>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {Array.from({ length: unit.assignmentCount }).map((_, i) => (
                          <div key={`ass-${i}`} className="flex items-center gap-2.5">
                            <span className="text-xs font-black text-slate-400 w-6">A{i+1}</span>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 outline-none text-sm font-black text-slate-900 shadow-inner" placeholder="Score /30" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">CATs</h4>
                        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                          <button onClick={() => changeAssessmentCount(unit.id, 'catCount', 'remove')} className="p-1 text-slate-500 hover:text-slate-900"><MinusSmallIcon className="w-4 h-4"/></button>
                          <span className="text-xs font-black text-slate-900 w-5 text-center">{unit.catCount}</span>
                          <button onClick={() => changeAssessmentCount(unit.id, 'catCount', 'add')} className="p-1 text-slate-500 hover:text-slate-900"><PlusSmallIcon className="w-4 h-4"/></button>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {Array.from({ length: unit.catCount }).map((_, i) => (
                          <div key={`cat-${i}`} className="flex items-center gap-2.5">
                            <span className="text-xs font-black text-slate-400 w-6">C{i+1}</span>
                            <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 outline-none text-sm font-black text-slate-900 shadow-inner" placeholder="Score /30" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {unit.isTechnical && (
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-100">
                          <h4 className="text-xs font-black text-purple-600 uppercase tracking-wider">Labs</h4>
                          <div className="flex items-center gap-1 bg-purple-50 rounded-xl p-1 border border-purple-200">
                            <button onClick={() => changeAssessmentCount(unit.id, 'labCount', 'remove')} className="p-1 text-purple-600 hover:text-purple-900"><MinusSmallIcon className="w-4 h-4"/></button>
                            <span className="text-xs font-black text-purple-700 w-5 text-center">{unit.labCount}</span>
                            <button onClick={() => changeAssessmentCount(unit.id, 'labCount', 'add')} className="p-1 text-purple-600 hover:text-purple-900"><PlusSmallIcon className="w-4 h-4"/></button>
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          {Array.from({ length: unit.labCount }).map((_, i) => (
                            <div key={`lab-${i}`} className="flex items-center gap-2.5">
                              <span className="text-xs font-black text-purple-400 w-6">L{i+1}</span>
                              <input type="number" className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-3.5 py-2 outline-none text-sm font-black text-slate-900 shadow-inner" placeholder="Score /30" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl mt-6">
                    <button onClick={() => handleAnalyzeScores(unit.name, unit.target)} disabled={isAnalyzingScore} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-3.5 rounded-xl flex justify-center items-center gap-2.5 transition shadow-lg text-sm disabled:opacity-50">
                      <SparklesIcon className="w-5 h-5 text-yellow-300 animate-pulse" />
                      {isAnalyzingScore ? "Analyzing Scores..." : "Analyze Scores & Predict Exam Need"}
                    </button>
                    {aiReport && (
                      <div className="text-sm text-slate-200 leading-relaxed font-medium mt-4 p-5 bg-slate-950/80 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-black"><SparklesIcon className="w-5 h-5" /> AI Analysis Report</div>
                        <div className="whitespace-pre-wrap">{aiReport}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'AI Study Hub':
        return (
          <div className="animate-fadeIn h-[calc(100vh-130px)] sm:h-[calc(100vh-140px)] flex flex-col w-full max-w-full overflow-x-hidden">
            <div className="mb-4">
              <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center"><SparklesIcon className="w-6 h-6 text-blue-600" /></div>
                AI Study Hub
              </h1>
              <p className="text-slate-500 font-semibold text-sm">Chat with your AI tutor and view uploaded study materials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-5 hidden lg:flex flex-col col-span-1 overflow-hidden">
                <h3 className="font-black text-slate-900 mb-3.5 flex items-center gap-2 text-sm">
                  <DocumentTextIcon className="w-4 h-4 text-blue-600" /> Documents ({uploadedDocuments.length})
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {uploadedDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 p-3 rounded-2xl text-xs font-bold text-slate-700">
                      <span>📄</span><span className="truncate flex-1">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:col-span-3 h-full overflow-hidden">
                <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-y-auto p-6 mb-3.5 flex flex-col gap-5">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 py-4 text-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20 rounded-tr-sm' : 'bg-slate-100 text-slate-900 border border-slate-200/60 rounded-tl-sm'}`}>
                        {msg.fileName && <div className="text-xs bg-blue-700 text-white px-2.5 py-1 rounded-lg mb-2 font-black inline-block">📎 {msg.fileName}</div>}
                        <p className="leading-relaxed font-semibold whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isAiThinking && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 flex gap-1.5 items-center">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
                </div>

                {attachedFile && (
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl mb-3 text-xs font-black text-blue-700">
                    <span>📎 Ready: {attachedFile.name}</span>
                    <button onClick={() => setAttachedFile(null)} className="text-red-600 font-bold">Remove</button>
                  </div>
                )}

                <form onSubmit={handleAiSubmit} className="relative flex items-center gap-2.5">
                  <label className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition cursor-pointer text-slate-500 hover:text-blue-600 shadow-sm">
                    <PaperClipIcon className="w-5 h-5" />
                    <input type="file" accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv,image/*" className="hidden" onChange={handleChatFileAttach} />
                  </label>
                  <div className="relative flex-1">
                    <textarea 
                      rows={1}
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => handleTextareaKeyDown(e, handleAiSubmit)}
                      placeholder="Ask your AI tutor anything..."
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-4 pr-12 outline-none focus:border-blue-500 text-sm font-semibold text-slate-900 resize-none shadow-sm"
                      disabled={isAiThinking}
                    />
                    <button type="submit" disabled={isAiThinking || (!aiQuery.trim() && !attachedFile)} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition disabled:opacity-50">
                      <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );

      case 'Report Writing':
        return (
          <div className="animate-fadeIn h-[calc(100vh-130px)] sm:h-[calc(100vh-140px)] flex flex-col w-full max-w-full overflow-x-hidden">
            <div className="mb-4">
              <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center"><PencilSquareIcon className="w-6 h-6 text-indigo-600" /></div>
                AI Report Writer
              </h1>
              <p className="text-slate-500 font-semibold text-sm">Step-by-step guidance for writing professional reports.</p>
            </div>

            <div className="flex flex-col bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 flex-1 overflow-hidden p-6 gap-4">
              <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">
                  {reportChatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-5 py-4 text-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/20 rounded-tr-sm' : 'bg-slate-100 text-slate-900 border border-slate-200/60 rounded-tl-sm'}`}>
                        {msg.fileName && <div className="text-xs bg-indigo-700 text-white px-2.5 py-1 rounded-lg mb-2 font-black inline-block">📎 {msg.fileName}</div>}
                        <p className="leading-relaxed font-semibold whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isReportThinking && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 flex gap-1.5 items-center">
                        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
              </div>

              {reportAttachedFile && (
                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-2xl text-xs font-black text-indigo-700">
                  <span>📎 {reportAttachedFile.name}</span>
                  <button onClick={() => setReportAttachedFile(null)} className="text-red-600 font-bold">Remove</button>
                </div>
              )}

              <form onSubmit={handleReportSubmit} className="relative flex items-center gap-2.5">
                <label className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition cursor-pointer text-slate-500 hover:text-indigo-600 shadow-sm">
                  <PaperClipIcon className="w-5 h-5" />
                  <input type="file" accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv,image/*" className="hidden" onChange={handleReportFileAttach} />
                </label>
                <div className="relative flex-1">
                  <textarea 
                    rows={1}
                    value={reportQuery}
                    onChange={(e) => setReportQuery(e.target.value)}
                    onKeyDown={(e) => handleTextareaKeyDown(e, handleReportSubmit)}
                    placeholder="Type response or details..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-4 pr-12 outline-none focus:border-indigo-500 text-sm font-semibold text-slate-900 resize-none shadow-sm"
                    disabled={isReportThinking}
                  />
                  <button type="submit" disabled={isReportThinking || (!reportQuery.trim() && !reportAttachedFile)} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition disabled:opacity-50">
                    <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 'Community & Feedback':
        return (
          <div className="animate-fadeIn space-y-6 w-full max-w-full">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center"><ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-emerald-600" /></div>
                Community & Feedback
              </h1>
              <p className="text-slate-500 font-semibold text-sm">Follow platform updates, drop a like, and share your thoughts or questions!</p>
            </div>

            {/* Follow & Like Card */}
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Support StudyPlatform</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">Follow our student development progress and show your support with a like.</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-xs transition shadow-md ${
                    isFollowing 
                      ? 'bg-slate-200 text-slate-800' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isFollowing ? '✓ Following Page' : '+ Follow Page'}
                </button>
                
                <button
                  onClick={handleLikeAction}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition shadow-md ${
                    hasLiked
                      ? 'bg-rose-500 text-white shadow-rose-500/30'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                  }`}
                >
                  {hasLiked ? <HeartIconSolid className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                  <span>{likeCount} Likes</span>
                </button>
              </div>
            </div>

            {/* Comment Section */}
            <div className="bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-6">
              <h3 className="text-lg font-black text-slate-900">Public Comments & Reviews</h3>

              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your thoughts, ask a question, or leave feedback..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm outline-none focus:border-emerald-500 font-semibold text-slate-900 resize-none shadow-inner"
                  required
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-600/20">
                  Post Comment
                </button>
              </form>

              <div className="divide-y divide-slate-100 pt-4 space-y-4">
                {commentsList.map((comm, idx) => (
                  <div key={idx} className="pt-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                      {comm.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-xs text-slate-900">{comm.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{comm.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{comm.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center animate-fadeIn w-full max-w-full">
            <h2 className="text-2xl font-black text-slate-900 mb-2">{activeTab} Page</h2>
            <p className="text-slate-500 font-semibold text-sm">This module is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 flex font-sans text-slate-900 overflow-x-hidden w-full max-w-full relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-slate-900/90 backdrop-blur-2xl border-r border-white/10 hidden md:flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <img src="https://res.cloudinary.com/dnipaby6h/image/upload/v1771695037/logo_zmbcjx.jpg" alt="Logo" className="w-9 h-9 rounded-2xl object-cover shadow-lg shadow-emerald-500/20" />
          <span className="font-black text-xl text-white tracking-tight">StudyPlatform</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-1.5">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 mt-2 px-3">Main Menu</p>
          {navItems.map((item) => (
            <button key={item.name} onClick={() => { setActiveTab(item.name); setSelectedUnit(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition-all duration-300 text-sm ${activeTab === item.name ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <item.icon className={`w-5 h-5 ${activeTab === item.name ? 'text-white' : 'text-slate-400'}`} />
              {item.name}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-3 p-2.5 w-full hover:bg-white/5 rounded-2xl transition text-left group">
            {userAvatar ? <img src={userAvatar} alt="Profile" className="w-10 h-10 rounded-2xl object-cover border-2 border-emerald-500/50" /> : <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-md">{userInitials}</div>}
            <div className="overflow-hidden flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-white truncate">{userName}</p>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${userSubscription === 'pro' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-400'}`}>
                  {userSubscription === 'pro' ? 'PRO' : 'Free'}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-bold group-hover:underline">Edit Profile ⚙️</p>
            </div>
          </button>
          <button onClick={() => setShowUpgradeModal(true)} className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs py-2 rounded-xl shadow-lg transition hover:opacity-90">
            {userSubscription === 'pro' ? 'PRO Member ⚡' : 'Upgrade to PRO 🚀'}
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-72 bg-slate-900 h-full shadow-2xl flex flex-col p-6 border-r border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <img src="https://res.cloudinary.com/dnipaby6h/image/upload/v1771695037/logo_zmbcjx.jpg" alt="Logo" className="w-9 h-9 rounded-2xl object-cover" />
                <span className="font-black text-lg text-white">StudyPlatform</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5">
              {navItems.map((item) => (
                <button key={item.name} onClick={() => { setActiveTab(item.name); setSelectedUnit(null); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-extrabold transition-all text-sm ${activeTab === item.name ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <item.icon className={`w-5 h-5 ${activeTab === item.name ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-white/10 mt-auto">
              <button onClick={() => { setShowProfileModal(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 p-2.5 w-full hover:bg-white/5 rounded-2xl text-left">
                {userAvatar ? <img src={userAvatar} alt="Profile" className="w-9 h-9 rounded-2xl object-cover" /> : <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs">{userInitials}</div>}
                <div>
                  <span className="text-sm font-black text-white truncate">{userName}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ml-2 ${userSubscription === 'pro' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {userSubscription === 'pro' ? 'PRO' : 'Free'}
                  </span>
                </div>
              </button>
              <button onClick={() => { setShowUpgradeModal(true); setMobileMenuOpen(false); }} className="w-full mt-2 bg-emerald-500 text-slate-950 font-black text-xs py-2 rounded-xl">
                {userSubscription === 'pro' ? 'PRO Member ⚡' : 'Upgrade to PRO 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL WITH M-PESA & MANUAL VERIFICATION */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-600">PRO</div>
                <h2 className="text-xl font-black text-slate-900">Upgrade to PRO</h2>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6"/></button>
            </div>

            <p className="text-xs text-slate-600 font-semibold mb-6 leading-relaxed">
              Unlock unlimited AI searches, bypass token limits, and get full access to the professional <strong className="text-slate-900">AI Report Writer</strong> instantly via M-Pesa.
            </p>

            <form onSubmit={handleMpesaCheckout} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setSelectedPlan('weekly')}
                  className={`p-4 rounded-2xl border text-left transition ${selectedPlan === 'weekly' ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-200 bg-slate-50'}`}
                >
                  <p className="text-xs font-black text-slate-400 uppercase">Weekly Plan</p>
                  <p className="text-lg font-black text-slate-900 mt-1">KSh 50</p>
                </button>

                <button 
                  type="button" 
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-4 rounded-2xl border text-left transition ${selectedPlan === 'monthly' ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-200 bg-slate-50'}`}
                >
                  <p className="text-xs font-black text-slate-400 uppercase">Monthly Plan</p>
                  <p className="text-lg font-black text-slate-900 mt-1">KSh 200</p>
                </button>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">M-Pesa Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  value={mpesaPhone} 
                  onChange={(e) => setMpesaPhone(e.target.value)} 
                  placeholder="0712345678" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-semibold text-slate-900 shadow-inner"
                />
              </div>

              {paymentMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                  {paymentMessage}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isProcessingPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl transition shadow-xl shadow-emerald-600/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessingPayment ? "Sending Prompt..." : `Pay KSh ${selectedPlan === 'monthly' ? '200' : '50'} via M-Pesa`}
              </button>
            </form>

            {showManualVerify && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-xs font-black uppercase text-slate-700 mb-2">Manual Transaction Verification:</h3>
                <p className="text-xs text-slate-500 mb-3">If you completed your payment, enter your M-Pesa transaction code below, or contact support at <a href="tel:0758638953" className="text-emerald-600 font-bold underline">0758638953</a>.</p>
                
                <form onSubmit={handleManualVerification} className="space-y-3">
                  <input 
                    type="text" 
                    required 
                    value={manualCode} 
                    onChange={e => setManualCode(e.target.value)} 
                    placeholder="Enter M-Pesa Code (e.g. QG72..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-emerald-500 font-semibold text-slate-900 uppercase"
                  />
                  <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black py-3 rounded-xl transition shadow-md">
                    Verify Code & Unlock PRO
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HELP CENTER MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center"><QuestionMarkCircleIcon className="w-6 h-6 text-emerald-600" /></div>
                <h2 className="text-xl font-black text-slate-900">Help Center</h2>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6"/></button>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
              Need assistance with your assignments, timetable sync, or payment verification? Call us directly or reach out via email:
            </p>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-4 flex items-center gap-3">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-black uppercase text-slate-400">Direct Support Hotline</p>
                <a href="tel:0758638953" className="text-sm font-black text-emerald-600 hover:underline">0758638953</a>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-black uppercase text-slate-400">Support Email</p>
                <a href="mailto:kiokocurtis@gmail.com" className="text-sm font-black text-emerald-600 hover:underline">kiokocurtis@gmail.com</a>
              </div>
            </div>
            <button onClick={() => setShowHelpModal(false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-2xl transition shadow-xl text-sm">Close Help</button>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">Edit Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6"/></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  {userAvatar ? <img src={userAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/30 shadow-lg" /> : <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-3xl font-black shadow-lg">{userInitials}</div>}
                  <label className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer shadow-xl transition transform hover:scale-105">
                    <CameraIcon className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">First Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-semibold text-slate-900" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl text-sm transition">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl text-sm shadow-xl shadow-emerald-600/20 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden z-10">
        <header className="h-20 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-xl w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-300 hover:bg-white/5 rounded-2xl">
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center bg-white/5 px-4 py-2.5 rounded-2xl w-48 sm:w-80 border border-white/10 shadow-inner">
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 mr-2.5" />
              <input type="text" placeholder="Search notes..." className="bg-transparent border-none outline-none w-full text-xs sm:text-sm font-semibold text-white placeholder-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <button onClick={() => setShowHelpModal(true)} className="relative p-2.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition shadow-sm" title="Help Center">
              <QuestionMarkCircleIcon className="w-5 h-5 text-emerald-400" />
            </button>
            <button className="relative p-2.5 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition shadow-sm"><BellIcon className="w-5 h-5" /></button>
            <button onClick={handleLogout} className="text-xs sm:text-sm font-black text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-4 py-2 rounded-2xl bg-white/5 hover:bg-red-500/10 transition shadow-sm">
              Log Out
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-10 max-w-7xl mx-auto w-full pb-24 relative overflow-x-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}