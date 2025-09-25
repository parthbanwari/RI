import React from 'react';
import { Bell, Clock, Edit, Trash2, FileText, CheckCircle, Calendar } from 'lucide-react';

const ReminderCard = ({ reminder, onEdit, onDelete }) => {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = () => {
    const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
    return reminderDateTime < new Date();
  };

  const getStatus = () => {
    if (reminder.notified) return { text: 'Completed', color: 'text-gray-500 dark:text-gray-300' };
    if (isOverdue()) return { text: 'Overdue', color: 'text-red-500 dark:text-red-400' };
    return { text: 'Scheduled', color: 'text-black dark:text-white' }; // 🔥 black in light mode, white in dark mode
  };


  const status = getStatus();

  // Demo reminder for display
  const demoReminder = reminder || {
    id: 1,
    title: "Birthday",
    date: "2025-09-28",
    time: "12:00",
    description: "ASDFGHJ",
    notified: false
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-4 sm:p-6 md:p-8 shadow-2xl">
      {/* Reminder Header */}
      <div className="flex items-start justify-between mb-6 sm:mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wider">Reminder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {demoReminder.title}
          </h1>
        </div>
      </div>

      {/* Reminder Details Grid */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Time Card */}
        <div className="bg-gray-50/70 dark:bg-slate-700/40 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-slate-600/30">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="p-2 sm:p-3 bg-blue-600/20 rounded-lg sm:rounded-xl border border-blue-500/30">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wide mb-1 sm:mb-2">Date & Time</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {formatTime(demoReminder.time)}
              </p>
              <p className="text-gray-600 dark:text-slate-300 text-sm">{formatDate(demoReminder.date)}</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gray-50/70 dark:bg-slate-700/40 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-slate-600/30">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="p-2 sm:p-3 bg-green-600/20 rounded-lg sm:rounded-xl border border-green-500/30">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wide mb-1 sm:mb-2">Status</h3>
              <p className={`text-lg sm:text-xl font-bold ${status.color}`}>
                {status.text}
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {demoReminder.description && (
        <div className="mb-6 sm:mb-8">
          <div className="bg-gray-50/70 dark:bg-slate-700/40 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-slate-600/30">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 sm:p-3 bg-purple-600/20 rounded-lg sm:rounded-xl border border-purple-500/30">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wide mb-2 sm:mb-3">Description</h3>
                <p className="text-gray-700 dark:text-slate-200 leading-relaxed text-sm sm:text-base md:text-lg">{demoReminder.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-slate-600/50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            onClick={() => onEdit && onEdit(demoReminder)}
            className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
            <span className="text-sm sm:text-base">Edit Reminder</span>
          </button>
        </div>
        
        <button
          onClick={() => onDelete && onDelete(demoReminder.id)}
          className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600/80 hover:bg-red-600 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 border border-red-500/30 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm sm:text-base">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ReminderCard;