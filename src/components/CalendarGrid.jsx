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
            className="h-28 sm:h-36 bg-slate-50/50 dark:bg-slate-800/30"
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

        days.push(
          <div
            key={day}
            className={`h-28 sm:h-36 border-r border-b border-slate-200/60 dark:border-slate-700/50 p-2 sm:p-3 cursor-pointer transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 hover:shadow-sm group ${
              isCurrentDay
                ? 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 ring-2 ring-blue-300/50 dark:ring-blue-600/30'
                : 'bg-white dark:bg-slate-900'
            } ${isPast ? 'opacity-60' : ''}`}
            onClick={() => onDateClick(date)}
          >
            <div
              className={`text-sm font-semibold mb-2 transition-colors duration-200 ${
                isCurrentDay
                  ? 'text-blue-700 dark:text-blue-300'
                  : isPast
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
              }`}
            >
              {day}
            </div>

            <div className="space-y-1.5 overflow-hidden">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 rounded-md truncate border border-emerald-200/50 dark:border-emerald-700/30 shadow-sm hover:shadow-md transition-shadow duration-150 relative"
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

              {dayReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 rounded-md truncate border border-amber-200/50 dark:border-amber-700/30 shadow-sm hover:shadow-md transition-shadow duration-150 relative"
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
                    <span className="text-amber-600 dark:text-amber-400">🔔</span>
                    <span className="font-medium">{reminder.title}</span>
                  </div>
                </div>
              ))}
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

        days.push(
          <div
            key={i}
            className={`h-28 sm:h-36 border-r border-b border-slate-200/60 dark:border-slate-700/50 p-2 sm:p-3 cursor-pointer transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 hover:shadow-sm group ${
              isCurrentDay
                ? 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 ring-2 ring-blue-300/50 dark:ring-blue-600/30'
                : 'bg-white dark:bg-slate-900'
            } ${isPast ? 'opacity-60' : ''}`}
            onClick={() => onDateClick(date)}
          >
            <div
              className={`text-sm font-semibold mb-2 transition-colors duration-200 ${
                isCurrentDay
                  ? 'text-blue-700 dark:text-blue-300'
                  : isPast
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
              }`}
            >
              {date.getDate()} {date.toLocaleString('en-US', { weekday: 'short' })}
            </div>

            <div className="space-y-1.5 overflow-hidden">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-xs px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 rounded-md truncate border border-emerald-200/50 dark:border-emerald-700/30 shadow-sm hover:shadow-md transition-shadow duration-150"
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
                    <span className="text-amber-600 dark:text-amber-400">🔔</span>
                    <span className="font-medium">{reminder.title}</span>
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/80 border-b border-slate-200/60 dark:border-slate-700/50">
        <button
          onClick={previous}
          className="p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>


        <div className="flex items-center justify-center space-x-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300">
            {viewMode === "monthly"
              ? `${getMonthName(month)} ${year}`
              : (() => {
                  const dayOfWeek = currentDate.getDay(); // 0=Sunday
                  const sunday = new Date(currentDate);
                  sunday.setDate(currentDate.getDate() - dayOfWeek);

                  const saturday = new Date(sunday);
                  saturday.setDate(sunday.getDate() + 6);

                  return `${sunday.getDate()} ${getMonthName(sunday.getMonth())} - ${saturday.getDate()} ${getMonthName(saturday.getMonth())} ${saturday.getFullYear()}`;
                })()}
          </h2>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly</span>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={viewMode === 'weekly'}
                onChange={() =>
                  setViewMode(viewMode === 'monthly' ? 'weekly' : 'monthly')
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-slate-700 peer-checked:bg-blue-600 transition-all duration-200"></div>
              <div
                className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-200 peer-checked:translate-x-5"
              ></div>
            </label>

            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Weekly</span>
          </div>
        </div>
        
        <button
          onClick={next}
          className="p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div
            key={day}
            className={`p-4 text-center text-sm font-bold tracking-wider ${
              index === 0 || index === 6 
                ? 'text-rose-600 dark:text-rose-400' 
                : 'text-slate-700 dark:text-slate-300'
            } border-r border-slate-200/60 dark:border-slate-700/50 last:border-r-0`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className={`grid ${viewMode === 'monthly' ? 'grid-cols-7' : 'grid-cols-7'} bg-slate-50/30 dark:bg-slate-800/20`}>
        {renderCalendarDays()}
      </div>

    </div>
     <Modal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        title="Today's Reminders"
      >
        <div className="space-y-4">
          {/* Upcoming Today */}
          {todayUpcoming.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">Upcoming reminders</h4>
              <ul className="list-disc pl-5 space-y-1">
                {todayUpcoming.map(r => (
                  <li key={r.id}>{r.title} at {r.time}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Missed Today */}
          {todayMissed.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1">Past Reminders</h4>
              <ul className="list-disc pl-5 space-y-1">
                {todayMissed.map(r => (
                  <li key={r.id}>{r.title} at {r.time}</li>
                ))}
              </ul>
            </div>
          )}

          {todayUpcoming.length === 0 && todayMissed.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300">No reminders for today.</p>
          )}
        </div>
      </Modal>
      {hoveredItem && (
        <div
          className="fixed z-50 max-w-xs p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg pointer-events-none transition-all"
          style={{
            top: hoveredItem.position.y + 10, // offset a bit from cursor
            left: hoveredItem.position.x + 10,
          }}
        >
          {hoveredItem.type === 'event' ? (
            <div>
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">
                {hoveredItem.data.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {hoveredItem.data.startTime} - {hoveredItem.data.endTime}
              </p>
              {hoveredItem.data.description && (
                <p className="text-sm mt-1 text-slate-700 dark:text-slate-200">
                  {hoveredItem.data.description}
                </p>
              )}
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                {hoveredItem.data.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Time: {hoveredItem.data.time}
              </p>
              {hoveredItem.data.notes && (
                <p className="text-sm mt-1 text-slate-700 dark:text-slate-200">
                  {hoveredItem.data.notes}
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