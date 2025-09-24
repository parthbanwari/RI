import { useState, useEffect } from 'react';
import { saveEvents, getEvents } from '../utils/storage';

export const useEvents = (user) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) {
      const userEvents = getEvents(user);
      setEvents(userEvents);
    }
  }, [user]);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    if (user) {
      saveEvents(user, updatedEvents);
    }
    return newEvent;
  };

  const updateEvent = (id, updatedEvent) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
    if (user) {
      saveEvents(user, updatedEvents);
    }
  };

  const deleteEvent = (id) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    if (user) {
      saveEvents(user, updatedEvents);
    }
  };

  const getEventsByDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate
  };
};