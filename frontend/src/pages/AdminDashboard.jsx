import React, { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Plus, Edit3, Trash2, Loader2, Calendar, Users, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import eventService from '../services/eventService';
import { formatDate } from '../utils/formatDate';

const AdminDashboard = () => {
  const { events, loading, fetchEvents } = useEvents();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    
    try {
      setDeletingId(id);
      await eventService.deleteEvent(id);
      fetchEvents(); // Refresh list
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && events.length === 0) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl">Admin Management</h1>
          <p className="text-gray-500 mt-2">Oversee all events and system performance.</p>
        </div>
        <Link to="/events/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} /> New Event
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 italic">
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Event Details</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600">Attendance</th>
              <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.length > 0 ? events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={event.image || 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=200'} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-800">{event.title}</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(event.date)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      event.availableSeats > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                   }`}>
                      {event.availableSeats > 0 ? 'Active' : 'Sold Out'}
                   </span>
                </td>
                <td className="px-6 py-6 font-medium text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-primary-500" />
                    {event.capacity - event.availableSeats} / {event.capacity}
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/dashboard`} className="p-2 text-gray-400 hover:text-primary-600 transition-colors" title="View">
                      <Eye size={18} />
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)}
                      disabled={deletingId === event._id}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50" 
                      title="Delete"
                    >
                      {deletingId === event._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-gray-400">
                  No events found. Click "New Event" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
