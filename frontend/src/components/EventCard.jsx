import React from 'react';
import { MapPin, Calendar as CalIcon, Users, ArrowRight, Loader2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/formatDate';

const EventCard = ({ event, onBook, isBooking }) => {
  const isExpired = new Date(event.date) < new Date();

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
      {/* Image Header */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <img 
          src={event.image || `https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=800`} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm uppercase tracking-wider">
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <CalIcon size={16} className="text-primary-500" />
            <span className="text-sm font-medium">{formatDate(event.date)} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-primary-500" />
            <span className="text-sm font-medium truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={16} className="text-primary-500" />
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div 
                  className="bg-primary-500 h-full" 
                  style={{ width: `${(event.availableSeats / event.capacity) * 100}%` }}
               ></div>
            </div>
            <span className="text-xs font-bold whitespace-nowrap">
              {event.availableSeats} left
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto">
          <button 
            onClick={onBook}
            disabled={event.availableSeats <= 0 || isBooking || isExpired}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              event.availableSeats > 0 && !isExpired
                ? 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white active:scale-95 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isBooking ? (
              <Loader2 className="animate-spin" size={18} />
            ) : isExpired ? (
              'Event Passed'
            ) : event.availableSeats > 0 ? (
              <>
                Book Now
                <ArrowRight size={18} />
              </>
            ) : (
              'Waitlist Full'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
