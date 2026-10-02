import { useState, useEffect } from 'react'
import api from './api'
import LogbookGrid from './LogbookGrid' // <-- Import the grid

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
      
      {/* Loop through all fetched logs and render a grid for each one */}
      {logs.map(log => (
        <div key={log.id} style={{ marginBottom: '40px' }}>
          <h2>Driver: {log.driver_name} | Date: {log.date}</h2>
          <LogbookGrid events={log.events} />
        </div>
      ))}

      {logs.length === 0 && <p>No logs found. Add some in the Django admin!</p>}
    </div>
  )
}

export default App