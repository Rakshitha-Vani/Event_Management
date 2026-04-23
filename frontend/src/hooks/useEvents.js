import { useState, useEffect } from 'react';
import eventService from '../services/eventService';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async (query = '') => {
    try {
      setLoading(true);
      const result = await eventService.getEvents(query);
      if (result.success) {
        setEvents(result.events || []);
      }
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (eventData) => {
    try {
      const result = await eventService.createEvent(eventData);
      if (result.success) {
        setEvents(prev => [...prev, result.data]);
        return result.data;
      }
    } catch (err) {
      setError(err || 'Failed to add event');
      throw err;
    }
  };

  const removeEvent = async (id) => {
    try {
      const result = await eventService.deleteEvent(id);
      if (result.success) {
        setEvents(prev => prev.filter(e => e._id !== id));
      }
    } catch (err) {
      setError(err || 'Failed to delete event');
      throw err;
    }
  };

  return { events, loading, error, fetchEvents, addEvent, removeEvent };
};
