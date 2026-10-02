import React from 'react';

const STATUS_Y_MAP = {
  'OFF': 40,
  'SB': 80,
  'D': 120,
  'ON': 160
};

export default function LogbookGrid({ events, violations = [] }) {
  const width = 800;
  const height = 200;
  const paddingLeft = 50;
  const graphWidth = width - paddingLeft - 20;

  const getX = (minute) => paddingLeft + (minute / 1440) * graphWidth;

  let pathD = "";
  
  if (events && events.length > 0) {
    events.forEach((ev, idx) => {
      const startX = getX(ev.start_minute);
      const endX = getX(ev.end_minute);
      const y = STATUS_Y_MAP[ev.status];

      if (idx === 0) {
        pathD += `M ${startX} ${y} H ${endX}`;
      } else {
        pathD += ` V ${y} H ${endX}`;
      }
    });
  }

  return (
    <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm max-w-[850px]">
      <h3 className="mt-0 mb-4 text-lg font-bold text-slate-800">24-Hour Duty Status</h3>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-slate-50 border border-slate-200 rounded">
        
        {Object.entries(STATUS_Y_MAP).map(([status, y]) => (
          <g key={status}>
            <text x={paddingLeft - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="bold" fill="#475569">
              {status}
            </text>
            <line x1={paddingLeft} y1={y} x2={width - 20} y2={y} stroke="#e2e8f0" strokeWidth="1" />
          </g>
        ))}

        {Array.from({ length: 25 }, (_, hour) => {
          const x = getX(hour * 60);
          const isMajor = hour % 6 === 0;
          return (
            <g key={hour}>
              <line x1={x} y1={25} x2={x} y2={175} stroke="#cbd5e1" strokeWidth={isMajor ? "1.5" : "0.5"} />
              <text x={x} y={20} textAnchor="middle" fontSize="10" fill="#64748b">
                {hour === 24 ? "M" : hour === 12 ? "N" : hour}
              </text>
            </g>
          );
        })}

        <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinejoin="miter" />

        {violations.map((v, i) => (
          <circle 
            key={i} 
            cx={getX(v.minute)} 
            cy={STATUS_Y_MAP['D']} 
            r="6" 
            fill="#ef4444" 
            stroke="#ffffff" 
            strokeWidth="2" 
          />
        ))}
      </svg>
    </div>
  );
}