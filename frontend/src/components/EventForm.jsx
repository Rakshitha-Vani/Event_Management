import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Loader2, Calendar, MapPin, Tag, Info } from 'lucide-react';
import eventService from '../services/eventService';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Technology',
    capacity: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let imageUrl = '';
      if (image) {
        // 1. Upload to Cloudinary
        const uploadData = new FormData();
        uploadData.append('image', image);
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: uploadData
        });
        
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        imageUrl = result.data;
      }

      // 2. Create Event
      await eventService.createEvent({ ...formData, image: imageUrl });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
      <h1 className="text-4xl mb-8">Host New Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="font-bold flex items-center gap-2"><Info size={18}/> Event Title</label>
          <input 
            required
            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
            placeholder="e.g. Annual Tech Conference"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="font-bold">Description</label>
          <textarea 
            required
            rows="4"
            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
            placeholder="Tell us more about the event..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* Date & Time */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-bold flex items-center gap-2"><Calendar size={18}/> Date</label>
            <input 
              type="date"
              required
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold">Time</label>
            <input 
              type="time"
              required
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>

        {/* Location & Capacity */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-bold flex items-center gap-2"><MapPin size={18}/> Location</label>
            <input 
              required
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
              placeholder="Full address or Online"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="font-bold">Capacity</label>
            <input 
              type="number"
              required
              className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
              placeholder="Number of participants"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="font-bold flex items-center gap-2"><Upload size={18}/> Event Image</label>
          <div className="relative group">
            <input 
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleImageChange}
            />
            <label 
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-primary-50 transition-colors bg-white overflow-hidden"
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                    Change Image
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                    <Upload size={32} />
                  </div>
                  <p className="text-gray-500 font-medium">Click to upload cover image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or JPEG (Max 5MB)</p>
                </>
              )}
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 font-medium text-center">{error}</p>}

        <button 
          type="submit"
          disabled={uploading}
          className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-lg"
        >
          {uploading ? (
            <><Loader2 className="animate-spin" /> Preparing your event...</>
          ) : (
            'Publish Event'
          )}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
