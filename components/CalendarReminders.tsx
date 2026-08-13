"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  CalendarIcon, 
  XMarkIcon, 
  PlusIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Lesson {
  id: string;
  unit?: string;
  title?: string;
  day: string;
  time: string;
  room?: string;
  isCustom?: boolean;
}

interface CalendarRemindersProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: Record<string, any[]>;
  userEmail: string;
}

export default function CalendarReminders({ isOpen, onClose, timetable, userEmail }: CalendarRemindersProps) {
  const [providerToken, setProviderToken] = useState<string | null>(null);
  const [targetEmail, setReminderEmail] = useState(userEmail || "");
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [customSessions, setCustomSessions] = useState<Lesson[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDay, setNewDay] = useState("Monday");
  const [newTime, setNewTime] = useState("14:00 - 16:00");
  const [newRoom, setNewRoom] = useState("");

  const getFlatTimetable = (): Lesson[] => {
    let list: Lesson[] = [];
    Object.keys(timetable).forEach(day => {
      timetable[day].forEach(item => {
        if (item.unit || item.time) {
          list.push({
            id: item.id ? item.id.toString() : `${day}-${Math.random()}`,
            unit: item.unit,
            day: day,
            time: item.time || "08:00 - 10:00",
            room: item.room || "Main Hall",
            isCustom: false
          });
        }
      });
    });
    return list;
  };

  const allLessons = [...getFlatTimetable(), ...customSessions];

  useEffect(() => {
    const checkOAuthToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.provider_token) {
        setProviderToken(session.provider_token);
      }
    };
    checkOAuthToken();
  }, []);

  const handleConnectGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar.events',
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLessons(allLessons.map(l => l.id));
    } else {
      setSelectedLessons([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLessons(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const customItem: Lesson = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      day: newDay,
      time: newTime,
      room: newRoom.trim() || "Self Study",
      isCustom: true
    };

    setCustomSessions(prev => [...prev, customItem]);
    setSelectedLessons(prev => [...prev, customItem.id]);
    setNewTitle("");
    setNewRoom("");
  };

  const handleRemoveCustomSession = (id: string) => {
    setCustomSessions(prev => prev.filter(c => c.id !== id));
    setSelectedLessons(prev => prev.filter(lId => lId !== id));
  };

  const handleSyncToGoogle = async () => {
    if (selectedLessons.length === 0) {
      alert("Please select at least one session using the checkboxes.");
      return;
    }

    if (!providerToken) {
      alert("Please connect your Google Account first.");
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);

    const eventsToSync = allLessons.filter(l => selectedLessons.includes(l.id));

    try {
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerToken: providerToken,
          calendarEmail: targetEmail,
          events: eventsToSync
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSyncStatus(`Successfully created ${result.count} event(s) in Google Calendar!`);
      } else {
        setSyncStatus(`Sync Error: ${result.error}`);
      }
    } catch (err) {
      setSyncStatus("Failed to communicate with sync server.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
      {/* Optimized sizing & mobile responsiveness */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Google Calendar Reminders</h2>
              <p className="text-[11px] text-slate-500 font-bold">Auto-sync timetable sessions & push alerts.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <XMarkIcon className="w-5 h-5"/>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto my-3 space-y-4 pr-1">
          
          {/* Email Settings & Google Connection */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                Notification Email
              </label>
              <input 
                type="email" 
                value={targetEmail} 
                onChange={(e) => setReminderEmail(e.target.value)} 
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 font-semibold text-slate-900 shadow-inner"
              />
            </div>

            <div className="w-full sm:w-auto mt-1 sm:mt-0">
              {!providerToken ? (
                <button 
                  onClick={handleConnectGoogle}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-3.5 h-3.5" alt="Google" />
                  Connect Google
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-extrabold">
                  <CheckCircleIcon className="w-4 h-4" /> Connected
                </div>
              )}
            </div>
          </div>

          {syncStatus && (
            <div className={`p-3 rounded-xl text-xs font-extrabold flex items-center gap-2 ${syncStatus.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
              {syncStatus.includes('Error') ? <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0"/> : <CheckCircleIcon className="w-4 h-4 flex-shrink-0"/>}
              <span>{syncStatus}</span>
            </div>
          )}

          {/* Sessions Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-900 text-white px-3.5 py-2.5 flex justify-between items-center">
              <h3 className="font-extrabold text-xs">Select Sessions to Sync</h3>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={selectedLessons.length > 0 && selectedLessons.length === allLessons.length}
                  className="w-3.5 h-3.5 text-emerald-600 rounded"
                />
                <span className="text-[11px] font-black text-slate-300">Select All ({allLessons.length})</span>
              </label>
            </div>

            <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-100">
              {allLessons.length === 0 ? (
                <p className="p-4 text-center text-xs text-slate-400 font-bold">No sessions found in your timetable.</p>
              ) : (
                allLessons.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-slate-50 transition cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedLessons.includes(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-900 truncate">{item.unit || item.title}</span>
                        {item.isCustom && (
                          <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0">Custom</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold truncate">{item.day} • {item.time} {item.room ? `• ${item.room}` : ''}</p>
                    </div>
                    {item.isCustom && (
                      <button 
                        onClick={(e) => { e.preventDefault(); handleRemoveCustomSession(item.id); }}
                        className="text-slate-300 hover:text-red-600 p-1 flex-shrink-0"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Add Additional Custom Session */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <h3 className="font-black text-[10px] uppercase tracking-wider text-slate-500 mb-2.5">
              Add Extra Session Outside Timetable
            </h3>
            <form onSubmit={handleAddCustomSession} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input 
                type="text" 
                required 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                placeholder="Session Title" 
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-500"
              />
              <select 
                value={newDay} 
                onChange={e => setNewDay(e.target.value)} 
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-500"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <input 
                type="text" 
                required 
                value={newTime} 
                onChange={e => setNewTime(e.target.value)} 
                placeholder="08:00 - 10:00" 
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-500"
              />
              <button 
                type="submit" 
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl py-2 flex items-center justify-center gap-1 transition"
              >
                <PlusIcon className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-2.5 flex-shrink-0">
          <button 
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-4 py-2.5 rounded-xl text-xs transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSyncToGoogle}
            disabled={isSyncing || selectedLessons.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <CalendarIcon className="w-4 h-4" />
            {isSyncing ? "Syncing..." : `Sync ${selectedLessons.length} Event(s)`}
          </button>
        </div>

      </div>
    </div>
  );
}