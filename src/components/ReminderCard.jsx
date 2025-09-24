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
    if (reminder.notified) return { text: 'Completed', color: 'text-green-400' };
    if (isOverdue()) return { text: 'Overdue', color: 'text-red-400' };
    return { text: 'Scheduled', color: 'text-green-400' };
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
    <div className="bg-slate-800 rounded-2xl p-6 max-w-md mx-auto">
      {/* Reminder Type Badge */}
      <div className="flex items-center mb-6">
        <div className="flex items-center px-3 py-1.5 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium uppercase tracking-wider">
          <Bell className="w-3 h-3 mr-1.5" />
          REMINDER
        </div>
      </div>

      {/* Reminder Title */}
      <h1 className="text-3xl font-bold text-white mb-8">{demoReminder.title}</h1>

      {/* Info Cards Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Date & Time Card */}
        <div className="bg-slate-700 rounded-2xl p-4">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="ml-2">
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">DATE & TIME</h3>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-white text-lg font-bold">{formatTime(demoReminder.time)}</p>
            <p className="text-slate-300 text-sm">{formatDate(demoReminder.date)}</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-700 rounded-2xl p-4">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Calendar className="w-4 h-4 text-green-400" />
            </div>
            <div className="ml-2">
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">STATUS</h3>
            </div>
          </div>
          <p className={`text-lg font-bold ${status.color}`}>{status.text}</p>
        </div>
      </div>

      {/* Description Section */}
      {demoReminder.description && (
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <FileText className="w-4 h-4 text-slate-400 mr-2" />
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">DESCRIPTION</h3>
          </div>
          <p className="text-white text-base">{demoReminder.description}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => onEdit && onEdit(demoReminder)}
          className="flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Reminder
        </button>

        <button
          onClick={() => onDelete && onDelete(demoReminder.id)}
          className="flex items-center justify-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ReminderCard;