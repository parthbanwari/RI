import emailjs from '@emailjs/browser';

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Show browser notification
export const showNotification = (title, body, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options
    });
  }
};

export const sendEmailNotification = async (userEmail, reminderMessage, reminderTime) => {
  const templateParams = {
    to_email: userEmail,    // goes to the logged-in user
    email: userEmail,       // optional, for reply-to
    message: reminderMessage,
    time: reminderTime,
    from_email: "309paradise@gmail.com",
  };

  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log('✅ Email sent successfully', result);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
const sentReminders = new Set(JSON.parse(sessionStorage.getItem('sentReminders') || '[]'));

export const checkReminders = (reminders, onReminderDue) => {
  const now = new Date();

  reminders.forEach(reminder => {
    const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
    const timeDiff = reminderTime.getTime() - now.getTime();

    // Only trigger if within 5 minutes before reminder and not already sent
    if (timeDiff <= 5 * 60 * 1000 && timeDiff >= 0 && !sentReminders.has(reminder.id)) {
      onReminderDue(reminder);
      sentReminders.add(reminder.id); 
      sessionStorage.setItem('sentReminders', JSON.stringify([...sentReminders]));
    }
  });
}; 