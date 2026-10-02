import { useState, useEffect } from 'react'
import api from './api'
import LogbookGrid from './LogbookGrid'

function App() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    api.get('logs/')
      .then(response => {
        setLogs(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Spotter ELD Logbook</h1>
      
      {logs.map(log => (
        <div key={log.id} style={{ marginBottom: '40px' }}>
          <h2>Driver: {log.driver_name} | Date: {log.date}</h2>
          
          <LogbookGrid events={log.events} violations={log.violations} />
          
          {/* ADD THIS: The Violations Warning Box */}
          {log.violations && log.violations.length > 0 && (
            <div style={{ 
              marginTop: '15px', 
              padding: '15px', 
              backgroundColor: '#fee2e2', 
              borderLeft: '5px solid #ef4444',
              maxWidth: '850px'
            }}>
              <h4 style={{ color: '#b91c1c', marginTop: 0 }}>⚠️ Compliance Violations Detected</h4>
              <ul style={{ color: '#991b1b', margin: 0, paddingLeft: '20px' }}>
                {log.violations.map((v, i) => (
                  <li key={i}>
                    <strong>Minute {v.minute}:</strong> {v.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      ))}

      {logs.length === 0 && <p>No logs found. Add some in the Django admin!</p>}
    </div>
  )
}

export default App