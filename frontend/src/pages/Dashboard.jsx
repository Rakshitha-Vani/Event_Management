import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import { Search, Filter, Loader2, Plus, AlertCircle } from 'lucide-react';
import eventService from '../services/eventService';
import { useAuth } from '../context/AuthContext';
const Dashboard = () => {
  const navigate = useNavigate();
  const { events, loading, error, fetchEvents } = useEvents();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [bookingLoadingId, setBookingLoadingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const categories = ['All', 'Technology', 'Entertainment', 'Food', 'Business', 'Education'];

  // Handle Search and Filter via API (Bonus: Server-side filtering)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let query = '?';
      if (searchTerm) query += `search=${searchTerm}&`;
      if (categoryFilter !== 'All') query += `category=${categoryFilter}`;
      fetchEvents(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, categoryFilter]);

  const handleBooking = async (event) => {
    if (!user) {
      setFeedback({ type: 'error', message: 'Please login to book events' });
      return;
    }

    try {
      setBookingLoadingId(event._id);
      const result = await eventService.bookEvent(event._id);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Event booked successfully!' });
        fetchEvents();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err || 'Something went wrong' });
    } finally {
      setBookingLoadingId(null);
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    }
  };

  if (error) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-4 max-w-md font-medium">
        {error}
      </div>
      <button onClick={() => fetchEvents()} className="btn-primary">Try Again</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Toast Feedback */}
      {feedback.message && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-xl animate-bounce flex items-center gap-3 ${
          feedback.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {feedback.type === 'success' ? '✅' : '❌'} {feedback.message}
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl mb-2">Discover Events</h1>
          <p className="text-gray-500">Connecting you to experiences across the globe.</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/events/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} /> Create Event
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search events..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-6 py-4 rounded-2xl font-semibold whitespace-nowrap transition-all border ${
                categoryFilter === cat 
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-100'
                  : 'bg-white text-gray-600 border-gray-100 hover:border-primary-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {loading && events.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center text-primary-600">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-bold">Fetching real-time data...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard 
              key={event._id} 
              event={event} 
              onBook={() => handleBooking(event)}
              isBooking={bookingLoadingId === event._id}
            />
          ))}
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6 font-outfit">
            ?
          </div>
          <h2 className="text-2xl mb-2">No results found</h2>
          <p className="text-gray-500">We couldn't find any events matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
