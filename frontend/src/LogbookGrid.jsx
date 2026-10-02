import React from 'react';

// Map each status to a specific Y-coordinate on the graph
const STATUS_Y_MAP = {
  'OFF': 40,
  'SB': 80,
  'D': 120,
  'ON': 160
};

export default function LogbookGrid({ events }) {
  const width = 800;
  const height = 200;
  const paddingLeft = 50;
  const graphWidth = width - paddingLeft - 20;

  // Helper function: converts a minute (0-1440) to an X-coordinate on the screen
  const getX = (minute) => paddingLeft + (minute / 1440) * graphWidth;

  // Build the SVG path string that connects all the events
  let pathD = "";
  
  if (events && events.length > 0) {
    events.forEach((ev, idx) => {
      const startX = getX(ev.start_minute);
      const endX = getX(ev.end_minute);
      const y = STATUS_Y_MAP[ev.status];

      if (idx === 0) {
        // Move to the starting point and draw a horizontal line
        pathD += `M ${startX} ${y} H ${endX}`;
      } else {
        // Draw a vertical line to the new status Y-level, then a horizontal line
        pathD += ` V ${y} H ${endX}`;
      }
    });
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginTop: '20px', maxWidth: '850px' }}>
      <h3 style={{ marginTop: 0 }}>24-Hour Duty Status</h3>
      
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', backgroundColor: '#f8fafc' }}>
        
        {/* Draw the 4 horizontal status lines */}
        {Object.entries(STATUS_Y_MAP).map(([status, y]) => (
          <g key={status}>
            <text x={paddingLeft - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="bold" fill="#333">
              {status}
            </text>
            <line x1={paddingLeft} y1={y} x2={width - 20} y2={y} stroke="#e5e7eb" strokeWidth="1" />
          </g>
        ))}

        {/* Draw the 24 vertical hour markers */}
        {Array.from({ length: 25 }, (_, hour) => {
          const x = getX(hour * 60);
          const isMajor = hour % 6 === 0; // Highlight every 6 hours
          return (
            <g key={hour}>
              <line x1={x} y1={25} x2={x} y2={175} stroke="#cbd5e1" strokeWidth={isMajor ? "1.5" : "0.5"} />
              <text x={x} y={20} textAnchor="middle" fontSize="10" fill="#64748b">
                {hour === 24 ? "M" : hour === 12 ? "N" : hour}
              </text>
            </g>
          );
        })}

        {/* Draw the actual driver's log line */}
        <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinejoin="miter" />
      </svg>
    </div>
  );
}