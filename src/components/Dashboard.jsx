import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Bell, ArrowLeft, Sparkles } from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import EventCard from './EventCard';
import ReminderCard from './ReminderCard';
import Modal from './Modal';
import EventForm from './EventForm';
import ReminderForm from './ReminderForm';
import { useEvents } from '../hooks/useEvents';
import useReminders from '../hooks/UseReminders'
import { requestNotificationPermission } from '../utils/notifications';

const Dashboard = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar');

  const { events, addEvent, updateEvent, deleteEvent, getEventsByDate } = useEvents(user);
  const { reminders, addReminder, updateReminder, deleteReminder, getRemindersByDate } = useReminders(user);

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setActiveTab('day');
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  const handleCreateReminder = () => {
    setEditingReminder(null);
    setShowReminderModal(true);
  };

  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setShowReminderModal(true);
  };

  const handleSaveReminder = (reminderData) => {
    if (editingReminder) {
      updateReminder(editingReminder.id, reminderData);
    } else {
      addReminder(reminderData);
    }
    setShowReminderModal(false);
    setEditingReminder(null);
  };

  const handleDeleteReminder = (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder(reminderId);
    }
  };

  const selectedDateEvents = getEventsByDate(selectedDate);
  const selectedDateReminders = getRemindersByDate(selectedDate);

  const renderCalendarView = () => (
    <div className="space-y-8">
      <CalendarGrid
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onDateClick={handleDateClick}
        events={events}
        reminders={reminders}
      />
    </div>
  );

  const renderDayView = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Your schedule for today
            </p>
          </div>
          <button
            onClick={() => setActiveTab('calendar')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 text-blue-700 dark:text-blue-300 hover:bg-white dark:hover:bg-slate-800 font-semibold text-sm rounded-xl border border-blue-200/50 dark:border-blue-700/50 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Calendar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl">
              <Calendar className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Events
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedDateEvents.length} scheduled
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                <Calendar className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  No events scheduled
                </p>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                  Create your first event to get started
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl">
              <Bell className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Reminders
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedDateReminders.length} active
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {selectedDateReminders.length > 0 ? (
              selectedDateReminders.map(reminder => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onEdit={handleEditReminder}
                  onDelete={handleDeleteReminder}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                <Bell className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  No reminders set
                </p>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
                  Add reminders to stay organized
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <Sparkles className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Manage events and reminders
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCreateEvent}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
              New Event
            </button>
            
            <button
              onClick={handleCreateReminder}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
              New Reminder
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl transition-all duration-200 ${
                activeTab === 'calendar'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Calendar View
            </button>
            
            {activeTab === 'day' && (
              <button
                onClick={() => setActiveTab('day')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-sm rounded-xl shadow-md scale-105"
              >
                <Bell className="h-4 w-4" />
                Day View
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        <div className="relative">
          {activeTab === 'calendar' ? renderCalendarView() : renderDayView()}
        </div>

        {/* Event Modal */}
        <Modal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          title={editingEvent ? 'Edit Event' : 'Create New Event'}
        >
          <EventForm
            event={editingEvent}
            onSave={handleSaveEvent}
            onCancel={() => {
              setShowEventModal(false);
              setEditingEvent(null);
            }}
          />
        </Modal>

        {/* Reminder Modal */}
        <Modal
          isOpen={showReminderModal}
          onClose={() => {
            setShowReminderModal(false);
            setEditingReminder(null);
          }}
          title={editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
        >
          <ReminderForm
            reminder={editingReminder}
            onSave={handleSaveReminder}
            onCancel={() => {
              setShowReminderModal(false);
              setEditingReminder(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;