import { useState, useEffect } from 'react';
import { saveReminders, getReminders } from '../utils/storage';
import { checkReminders, showNotification, sendEmailNotification } from '../utils/notifications';

export const useReminders = (user) => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (user) {
      const userReminders = getReminders(user);
      setReminders(userReminders);
    }
  }, [user]);

  // Check for due reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (reminders.length > 0) {
        checkReminders(reminders, handleReminderDue);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders]);

  const handleReminderDue = async (reminder) => {
    // Show browser notification
    showNotification(
      'Reminder',
      reminder.title,
      { tag: reminder.id }
    );

    // Send email notification (simulated)
    if (user) {
      await sendEmailNotification(
        user,
        'Reminder: ' + reminder.title,
        `You asked me to remind you: ${reminder.title}\nScheduled for: ${reminder.date} at ${reminder.time}`
      );
    }

    // Mark reminder as notified
    updateReminder(reminder.id, { ...reminder, notified: true });
  };

  const addReminder = (reminder) => {
    const newReminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      notified: false
    };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    if (user) {
      saveReminders(user, updatedReminders);
    }
    return newReminder;
  };

  const updateReminder = (id, updatedReminder) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, ...updatedReminder } : reminder
    );
    setReminders(updatedReminders);
    if (user) {
      saveReminders(user, updatedReminders);
    }
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    if (user) {
      saveReminders(user, updatedReminders);
    }
  };

  const getRemindersByDate = (date) => {
    return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.date);
      return reminderDate.toDateString() === date.toDateString();
    });
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getRemindersByDate
  };
};