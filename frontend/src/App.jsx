import { useState, useEffect } from 'react'
import api from './api'
import LogbookGrid from './LogbookGrid'
import AddEventForm from './AddEventForm'

function App() {
  const [logs, setLogs] = useState([])

  const fetchLogs = () => {
    api.get('logs/')
      .then(response => setLogs(response.data))
      .catch(error => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      api.delete(`events/${eventId}/`)
        .then(() => fetchLogs())
        .catch(err => console.error("Error deleting event:", err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-800">Spotter ELD Logbook</h1>
        
        {logs.map(log => (
          <div key={log.id} className="mb-12 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-6 text-slate-700">
              Driver: <span className="text-blue-600">{log.driver_name}</span> <span className="font-normal text-slate-400 mx-2">|</span> Date: {log.date}
            </h2>
            
            <LogbookGrid events={log.events} violations={log.violations} />
            
            {log.violations && log.violations.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 max-w-[850px] rounded-r shadow-sm">
                <h4 className="text-red-700 font-bold text-lg mb-2 flex items-center">
                  ⚠️ Compliance Violations Detected
                </h4>
                <ul className="list-disc pl-5 text-red-800 space-y-1">
                  {log.violations.map((v, i) => (
                    <li key={i}><strong>Minute {v.minute}:</strong> {v.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <AddEventForm logId={log.id} events={log.events} onEventAdded={fetchLogs} />
            
            <div className="mt-10 max-w-[850px]">
              <h3 className="border-b border-slate-200 pb-2 text-lg font-bold text-slate-700 mb-2">
                Logged Events
              </h3>
              <ul className="list-none">
                {log.events.map(ev => (
                  <li key={ev.id} className="flex justify-between items-center py-3 px-2 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <span className="text-slate-700">
                      <strong className="inline-block w-12 text-slate-900">{ev.status}</strong> | {formatTime(ev.start_minute)} - {formatTime(ev.end_minute)}
                    </span>
                    <button 
                      onClick={() => handleDeleteEvent(ev.id)} 
                      className="text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md font-bold text-sm transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <p className="text-slate-500 italic bg-white p-6 rounded-lg border border-slate-200">
            No logs found. Add an initial daily log in the Django admin!
          </p>
        )}
      </div>
    </div>
  )
}

export default App