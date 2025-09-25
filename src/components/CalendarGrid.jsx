import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from "./Modal";
import { getDaysInMonth, getFirstDayOfMonth, getMonthName, isToday, isPastDate } from '../utils/dateUtils';

const CalendarGrid = ({ currentDate, onDateChange, onDateClick, events, reminders }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [todayUpcoming, setTodayUpcoming] = useState([]);
  const [todayMissed, setTodayMissed] = useState([]);
  const [viewMode, setViewMode] = useState('monthly'); 
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    if (!reminders || reminders.length === 0) return;

    // Check if modal has already been shown this session
    const modalShown = sessionStorage.getItem('todayReminderModalShown');
    if (modalShown) return; // Already shown

    const now = new Date();
    const upcoming = [];
    const missed = [];

    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.date);
      if (reminderDate.toDateString() === now.toDateString()) {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const reminderDateTime = new Date(reminderDate);
        reminderDateTime.setHours(hours, minutes, 0, 0);

        if (reminderDateTime < now) {
          missed.push(reminder);
        } else {
          upcoming.push(reminder);
        }
      }
    });

    if (upcoming.length > 0 || missed.length > 0) {
      setTodayUpcoming(upcoming);
      setTodayMissed(missed);
      setShowReminderModal(true);
      // Mark as shown for this session
      sessionStorage.setItem('todayReminderModalShown', 'true');
    }
  }, [reminders]);

  const previous = () => {
    if (viewMode === "monthly") {
      const newDate = new Date(year, month - 1, 1);
      onDateChange(newDate);
    } else {
      // weekly -> go back 7 days
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      onDateChange(newDate);
    }
  };

  const next = () => {
    if (viewMode === "monthly") {
      const newDate = new Date(year, month + 1, 1);
      onDateChange(newDate);
    } else {
      // weekly -> go forward 7 days
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      onDateChange(newDate);
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getRemindersForDate = (date) => {
    return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.date);
      return reminderDate.toDateString() === date.toDateString();
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();

    if (viewMode === 'monthly') {
      // Empty cells before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(
          <div
            key={`empty-${i}`}
            className="h-20 sm:h-28 md:h-32 lg:h-36 bg-slate-50/50 dark:bg-slate-800/30 border-r border-b border-slate-200/40 dark:border-slate-700/40"
          />
        );
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEvents = getEventsForDate(date);
        const dayReminders = getRemindersForDate(date);
        const isCurrentDay = isToday(date);
        const isPast = isPastDate(date);
        const totalItems = dayEvents.length + dayReminders.length;

        days.push(
          <div
            key={day}
            className={`h-20 sm:h-28 md:h-32 lg:h-36 
                        border-r border-b border-slate-200/40 dark:border-slate-700/40 
                        p-1.5 sm:p-2 md:p-3 cursor-pointer 
                        transition-all duration-200 
                        hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 
                        dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 
                        hover:shadow-md hover:scale-[1.02] hover:z-10 
                        relative group flex flex-col`}   // ✅ added flex flex-col
            onClick={() => onDateClick(date)}
          >
            <div
              className={`text-xs sm:text-sm font-bold mb-1 sm:mb-2 self-end  // ✅ added self-end
                          ${isCurrentDay
                            ? 'text-blue-700 dark:text-blue-300'
                            : isPast
                            ? 'text-slate-400 dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
                          }`}
            >
              {day}
            </div>


            <div className="flex flex-col gap-0.5 sm:gap-1 overflow-hidden h-full">
              {/* Show first few events/reminders */}
              {dayEvents.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 rounded-md truncate border border-emerald-200/50 dark:border-emerald-700/30 shadow-sm hover:shadow-md transition-all duration-150 relative font-medium"
                  onMouseEnter={(e) =>
                    setHoveredItem({
                      type: 'event',
                      data: event,
                      position: { x: e.clientX, y: e.clientY },
                    })
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {event.title}
                </div>
              ))}

              {dayReminders.slice(0, 2).map((reminder) => (
                <div
                  key={reminder.id}
                  className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 rounded-md truncate border border-amber-200/50 dark:border-amber-700/30 shadow-sm hover:shadow-md transition-all duration-150 relative"
                  onMouseEnter={(e) =>
                    setHoveredItem({
                      type: 'reminder',
                      data: reminder,
                      position: { x: e.clientX, y: e.clientY },
                    })
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-amber-600 dark:text-amber-400 text-xs"></span>
                    <span className="font-medium truncate">{reminder.title}</span>
                  </div>
                </div>
              ))}

              {/* Show "+X more" if there are more items */}
              {totalItems > 4 && (
                <div className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md text-center font-medium border border-slate-200/50 dark:border-slate-700/50">
                  +{totalItems - 4} more
                </div>
              )}
            </div>
          </div>
        );
      }
    } else if (viewMode === 'weekly') {
      // Weekly view: get Sunday of current week
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday
      const sunday = new Date(currentDate);
      sunday.setDate(currentDate.getDate() - dayOfWeek);

      for (let i = 0; i < 7; i++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + i);

        const dayEvents = getEventsForDate(date);
        const dayReminders = getRemindersForDate(date);
        const isCurrentDay = isToday(date);
        const isPast = isPastDate(date);
        const totalItems = dayEvents.length + dayReminders.length;

        days.push(
          <div
            key={i}
            className={`h-32 sm:h-40 md:h-48 lg:h-56 
                        border-r border-b border-slate-200/40 dark:border-slate-700/40 
                        p-2 sm:p-3 md:p-4 cursor-pointer 
                        transition-all duration-200 
                        hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 
                        dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 
                        hover:shadow-md hover:scale-[1.02] hover:z-10 
                        relative group flex flex-col`}   // ✅ added flex flex-col
            onClick={() => onDateClick(date)}
          >
            <div
              className={`text-sm sm:text-base font-bold mb-2 sm:mb-3 self-end  // ✅ added self-end
                          ${isCurrentDay
                            ? 'text-blue-700 dark:text-blue-300'
                            : isPast
                            ? 'text-slate-400 dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
                          }`}
            >
              {date.getDate()}
            </div>



            <div className="space-y-1.5 overflow-hidden h-full">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 rounded-md truncate border border-emerald-200/50 dark:border-emerald-700/30 shadow-sm hover:shadow-md transition-shadow duration-150 font-medium"
                  title={`${event.title} (${event.startTime} - ${event.endTime})`}
                >
                  {event.title}
                </div>
              ))}

              {dayReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 rounded-md truncate border border-amber-200/50 dark:border-amber-700/30 shadow-sm hover:shadow-md transition-shadow duration-150"
                  title={`Reminder: ${reminder.title} at ${reminder.time}`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-amber-600 dark:text-amber-400"></span>
                    <span className="font-medium truncate">{reminder.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    return days;
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 md:p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/80 border-b border-slate-200/60 dark:border-slate-700/50 gap-3 sm:gap-0">
          
          {/* Navigation Buttons - Mobile */}
          <div className="flex items-center justify-between w-full sm:w-auto order-2 sm:order-1">
            <button
              onClick={previous}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              onClick={next}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer sm:hidden"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Title and View Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 text-center">
              {viewMode === "monthly"
                ? `${getMonthName(month)} ${year}`
                : (() => {
                    const dayOfWeek = currentDate.getDay();
                    const sunday = new Date(currentDate);
                    sunday.setDate(currentDate.getDate() - dayOfWeek);
                    const saturday = new Date(sunday);
                    saturday.setDate(sunday.getDate() + 6);
                    return `${sunday.getDate()} ${getMonthName(sunday.getMonth()).slice(0,3)} - ${saturday.getDate()} ${getMonthName(saturday.getMonth()).slice(0,3)} ${saturday.getFullYear()}`;
                  })()}
            </h2>

            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Monthly</span>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={viewMode === 'weekly'}
                  onChange={() =>
                    setViewMode(viewMode === 'monthly' ? 'weekly' : 'monthly')
                  }
                />
                <div className="w-9 sm:w-11 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-slate-700 peer-checked:bg-blue-600 transition-all duration-200"></div>
                <div className="absolute left-0.5 sm:left-1 top-0.5 sm:top-1 w-3.5 sm:w-4 h-3.5 sm:h-4 bg-white rounded-full shadow-md transform transition-all duration-200 peer-checked:translate-x-4 sm:peer-checked:translate-x-5"></div>
              </label>

              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Weekly</span>
            </div>
          </div>
          
          {/* Next Button - Desktop Only */}
          <button
            onClick={next}
            className="hidden sm:block p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer order-3"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div
              key={day}
              className={`p-2 sm:p-3 md:p-4 text-center text-xs sm:text-sm font-bold tracking-wider ${
                index === 0 || index === 6 
                  ? 'text-rose-600 dark:text-rose-400' 
                  : 'text-slate-700 dark:text-slate-300'
              } border-r border-slate-200/60 dark:border-slate-700/50 last:border-r-0`}
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className={`grid grid-cols-7 bg-slate-50/30 dark:bg-slate-800/20 min-h-[300px] sm:min-h-[400px] md:min-h-[500px]`}>
          {renderCalendarDays()}
        </div>
      </div>

      {/* Today's Reminders Modal */}
      <Modal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        title="Today's Reminders"
      >
        <div className="space-y-4">
          {todayUpcoming.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Upcoming reminders</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {todayUpcoming.map(r => (
                  <li key={r.id} className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{r.title}</span> at {r.time}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {todayMissed.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Past Reminders</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {todayMissed.map(r => (
                  <li key={r.id} className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{r.title}</span> at {r.time}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {todayUpcoming.length === 0 && todayMissed.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 text-sm">No reminders for today.</p>
          )}
        </div>
      </Modal>

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div
          className="fixed z-50 max-w-xs p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl pointer-events-none transition-all duration-200 hidden sm:block"
          style={{
            top: Math.min(hoveredItem.position.y + 10, window.innerHeight - 200),
            left: Math.min(hoveredItem.position.x + 10, window.innerWidth - 300),
          }}
        >
          {hoveredItem.type === 'event' ? (
            <div>
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1">
                {hoveredItem.data.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {hoveredItem.data.startTime} - {hoveredItem.data.endTime}
              </p>
              {hoveredItem.data.description && (
                <p className="text-sm mt-2 text-slate-700 dark:text-slate-200">
                  {hoveredItem.data.description}
                </p>
              )}
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                {hoveredItem.data.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Time: {hoveredItem.data.time}
              </p>
              {hoveredItem.data.description && (
                <p className="text-sm mt-2 text-slate-700 dark:text-slate-200">
                  {hoveredItem.data.description}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CalendarGrid;