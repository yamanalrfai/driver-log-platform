import React, { useState } from 'react';
import api from './api';

export default function AddEventForm({ logId, events, onEventAdded }) {
  const [status, setStatus] = useState('OFF');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!startTime || !endTime) {
      setError("Please select both a start and end time.");
      return;
    }

    const start_minute = timeToMinutes(startTime);
    const end_minute = timeToMinutes(endTime);

    if (start_minute >= end_minute) {
      setError("End time must be after start time.");
      return;
    }

    const hasOverlap = events.some(ev => {
      return (start_minute < ev.end_minute) && (end_minute > ev.start_minute);
    });

    if (hasOverlap) {
      setError("Error: This time overlaps with an existing event!");
      return; 
    }

    api.post('events/', {
      daily_log: logId,
      status: status,
      start_minute: start_minute,
      end_minute: end_minute
    })
    .then(() => {
      setStartTime('');
      setEndTime('');
      onEventAdded(); 
    })
    .catch(err => {
      console.error("Error saving event:", err);
      setError("Failed to save event. Check console.");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg max-w-[850px] flex flex-wrap gap-4 items-end shadow-sm">
      
      <div className="flex flex-col">
        <label className="text-xs font-bold mb-2 text-slate-600 uppercase tracking-wide">Status</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="p-2.5 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="OFF">Off Duty (OFF)</option>
          <option value="SB">Sleeper Berth (SB)</option>
          <option value="D">Driving (D)</option>
          <option value="ON">On Duty (ON)</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-bold mb-2 text-slate-600 uppercase tracking-wide">Start Time</label>
        <input 
          type="time" 
          value={startTime} 
          onChange={(e) => setStartTime(e.target.value)} 
          className="p-2.5 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-bold mb-2 text-slate-600 uppercase tracking-wide">End Time</label>
        <input 
          type="time" 
          value={endTime} 
          onChange={(e) => setEndTime(e.target.value)} 
          className="p-2.5 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
        />
      </div>

      <button 
        type="submit" 
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-sm transition-colors cursor-pointer"
      >
        Add Event
      </button>

      {error && <span className="text-red-600 text-sm font-semibold ml-2 flex-1">{error}</span>}
    </form>
  );
}