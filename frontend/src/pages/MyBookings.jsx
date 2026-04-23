import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import { formatDate } from '../utils/formatDate';
import { Calendar, MapPin, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const result = await eventService.getMyBookings();
      if (result.success) {
        setBookings(result.data || []);
      }
    } catch (err) {
      setError(err || 'Please login to see your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setCancellingId(bookingId);
      const result = await eventService.cancelBooking(bookingId);
      if (result.success) {
        // Optimistic UI update
        setBookings(prev => prev.filter(b => b._id !== bookingId));
      }
    } catch (err) {
      alert(err || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center">
      <Loader2 className="animate-spin inline-block text-primary-600 mb-4" size={48} />
      <p className="text-gray-500 font-bold">Synchronizing your schedule...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <AlertCircle size={64} className="text-red-400 mx-auto mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
      <p className="text-gray-500 mb-8">{error}</p>
      <Link to="/dashboard" className="btn-primary">Back to Events</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl">My Bookings</h1>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-bold text-sm">
          {bookings.length} reservations
        </div>
      </div>
      
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow group">
              <div className="w-full md:w-56 h-36 bg-gray-100 rounded-2xl overflow-hidden">
                 <img 
                    src={booking.eventId?.image || 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=800'} 
                    alt={booking.eventId?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                 />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{booking.eventId?.title || 'Unknown Event'}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} className="text-primary-500" />
                    {booking.eventId ? formatDate(booking.eventId.date) : 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={14} className="text-primary-500" />
                    {booking.eventId?.location || 'N/A'}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <span className="text-xs text-gray-400 italic">Booked on {formatDate(booking.createdAt)}</span>
                  {booking.status === 'confirmed' && (
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="flex items-center gap-1 text-red-500 text-sm font-bold hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === booking._id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <><XCircle size={16} /> Cancel Booking</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
          <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-2xl text-gray-600 mb-4 font-outfit">Your schedule is clear</h2>
          <Link to="/dashboard" className="btn-primary inline-block">
            Find Your Next Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
