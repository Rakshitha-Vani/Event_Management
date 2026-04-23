import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Loader2, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import eventService from '../services/eventService';
import { formatCurrency, formatDate } from '../utils/formatDate';

const Checkout = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const result = await eventService.getEventById(eventId);
        setEvent(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSimulatedPayment = async () => {
    setProcessing(true);
    try {
      // Simulate backend call to settle payment
      const result = await eventService.verifyPayment({
        eventId: event._id,
        isSimulated: true
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/bookings'), 2500);
      }
    } catch (err) {
      alert(err || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-600" size={48} />
    </div>
  );

  if (success) return (
    <div className="max-w-md mx-auto py-32 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 animate-bounce">
        <CheckCircle2 size={48} />
      </div>
      <h1 className="text-3xl mb-2 font-outfit">Payment Successful!</h1>
      <p className="text-gray-500">Your spot is confirmed. Redirecting to your bookings...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
      {/* Left: Summary */}
      <div className="space-y-8">
        <h1 className="text-4xl">Secure Checkout</h1>
        
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex gap-4">
            <img 
              src={event.image} 
              className="w-24 h-24 rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{event.title}</h2>
              <div className="text-sm text-gray-500 mt-1 space-y-1">
                <p className="flex items-center gap-2"><Calendar size={14}/> {formatDate(event.date)}</p>
                <p className="flex items-center gap-2"><MapPin size={14}/> {event.location}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-50 flex justify-between items-center text-2xl font-outfit">
            <span>Total Payable</span>
            <span className="text-primary-600 font-bold">{formatCurrency(event.price)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-400 justify-center">
          <ShieldCheck size={18} /> SSL Secured & Encrypted Processing
        </div>
      </div>

      {/* Right: Mock Payment Form */}
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
        <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
          <CreditCard size={24} className="text-primary-600" /> Payment Information
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Card Number</label>
            <input 
              readOnly 
              placeholder="4242 4242 4242 4242" 
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expiry</label>
              <input readOnly placeholder="12 / 26" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">CVC</label>
              <input readOnly placeholder="***" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none" />
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center italic">
            This is a simulated payment for development purposes. 
            No real money will be charged.
          </p>

          <button 
            onClick={handleSimulatedPayment}
            disabled={processing}
            className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-lg"
          >
            {processing ? (
              <><Loader2 className="animate-spin" /> Finalizing Booking...</>
            ) : (
              `Pay ${formatCurrency(event.price)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
