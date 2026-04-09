import React from "react";
const CalendarView = () => {
  const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      {/* Header */}
      <div className="flex justify-center items-center p-3 border-b">
        <button className="px-2">‹</button>
        <span className="font-semibold">April 2026</span>
        <button className="px-2">›</button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-xs text-gray-500 border-b">
        {days.map(day => (
          <div key={day} className="p-3 border-r">{day}</div>
        ))}
      </div>

      {/* Calendar Cells */}
      <div className="grid grid-cols-7">
        {Array.from({length:35}).map((_,i)=>(
          <div
            key={i}
            className="border h-[120px] p-2 text-sm"
          >
            {i+1}
          </div>
        ))}
      </div>

    </div>
  )
}
export default CalendarView