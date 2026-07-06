import React from "react";

const CalendarView = ({ currentMonth, currentYear, data = [] }) => {

  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];


  const dataMap = {};
  data.forEach((item) => {
    dataMap[item.day] = item;
  });


  const firstDay = new Date(currentYear, currentMonth - 1, 1);
  const startDay = (firstDay.getDay() + 6) % 7; // Monday start
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth - 1, 0).getDate();

  const cells = [];


  for (let i = 0; i < startDay; i++) {
    cells.push({
      day: prevMonthDays - startDay + i + 1,
      isCurrentMonth: false,
    });
  }


  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      isCurrentMonth: true,
      data: dataMap[i],
    });
  }


  while (cells.length < 35) {
    cells.push({
      day: cells.length - daysInMonth - startDay + 1,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="bg-white-common border border-gray-300 rounded-xl overflow-hidden">


      <div className="grid grid-cols-7 text-xs text-gray-500 border-b">
        {days.map(day => (
          <div key={day} className="p-3 border-r text-center font-medium">
            {day}
          </div>
        ))}
      </div>


      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const item = cell.data;

          return (
            <div
              key={i}
              className={`border border-gray-300 h-[120px] p-2 flex flex-col justify-between
                ${!cell.isCurrentMonth ? "bg-gray-50 text-gray-300" : ""}
              `}
            >

              <span className="text-sm font-medium">
                {cell.day}
              </span>


              {cell.isCurrentMonth && item && item.totalProperties > 0 && (
                <div className="flex flex-col gap-1 text-[11px]">

                  <div className="bg-green-600 text-white px-2 py-[2px] rounded-md w-fit">
                    {item.totalProperties} Properties
                  </div>

                  {/* {item.recurringPending > 0 && (
                    <div className="bg-green-500 text-white px-2 py-[2px] rounded-md w-fit">
                      {item.recurringPending} Recurring_Pending
                    </div>
                  )} */}

                  {item.subscriptionExpired > 0 && (
                    <div className="bg-orange-500 text-white px-2 py-[2px] rounded-md w-fit">
                      {item.subscriptionExpired} Sub_Expired
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;