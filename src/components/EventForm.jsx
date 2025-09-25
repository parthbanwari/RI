import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, Save, X } from 'lucide-react';

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        date: event.date || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        description: event.description || ''
      });
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate save delay
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
    }, 500);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Event Title
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="title"
            className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-sm sm:text-base ${
              errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter event title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            type="date"
            id="date"
            className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-sm sm:text-base ${
              errors.date ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
        {errors.date && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="time"
              id="startTime"
              className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-sm sm:text-base ${
                errors.startTime ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
            />
          </div>
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="time"
              id="endTime"
              className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors text-sm sm:text-base ${
                errors.endTime ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
            />
          </div>
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          className="block w-full px-3 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none text-sm sm:text-base"
          placeholder="Add event description..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 sm:py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4 inline mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 sm:py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2" />
          ) : (
            <Save className="h-4 w-4 inline mr-2" />
          )}
          {event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;