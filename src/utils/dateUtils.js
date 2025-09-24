export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date) => {
  return date.toTimeString().slice(0, 5);
};

export const formatDateTime = (date) => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const parseDateTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}`);
};

export const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const isToday = (date) => {
  const today = new Date();
  return isSameDay(date, today);
};

export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};