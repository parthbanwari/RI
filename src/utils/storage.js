// User authentication utilities
export const saveUser = (email) => {
  localStorage.setItem('currentUser', email);
};

export const getCurrentUser = () => {
  return localStorage.getItem('currentUser');
};

export const clearUser = () => {
  localStorage.removeItem('currentUser');
};

// Event storage utilities
export const saveEvents = (email, events) => {
  localStorage.setItem(`events_${email}`, JSON.stringify(events));
};

export const getEvents = (email) => {
  const events = localStorage.getItem(`events_${email}`);
  return events ? JSON.parse(events) : [];
};

// Reminder storage utilities
export const saveReminders = (email, reminders) => {
  localStorage.setItem(`reminders_${email}`, JSON.stringify(reminders));
};

export const getReminders = (email) => {
  const reminders = localStorage.getItem(`reminders_${email}`);
  return reminders ? JSON.parse(reminders) : [];
};

// Theme utilities
export const saveTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

export const getTheme = () => {
  return localStorage.getItem('theme') || 'light';
};