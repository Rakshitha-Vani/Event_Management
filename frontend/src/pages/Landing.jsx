import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, ArrowRight, Play } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="inline-block px-4 py-2 bg-primary-50 rounded-full text-primary-700 font-bold text-sm mb-8 animate-bounce">
            🚀 The #1 Event Management Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 font-outfit tracking-tight">
            Create Memories that <br/> 
            <span className="gradient-text italic">Last a Lifetime</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Plan, book, and discover the most exciting events happening around you. 
            The all-in-one platform for hosts and attendees alike.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="btn-primary flex items-center gap-2 w-full md:w-auto">
              Explore Events <ArrowRight size={20} />
            </Link>
            <button className="btn-secondary flex items-center gap-2 w-full md:w-auto">
              <Play size={20} fill="currentColor" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Illustration Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl mb-16">Why Choose Eventify?</h2>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="p-8 rounded-3xl bg-gray-50 hover:bg-primary-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl mb-3">Instant Booking</h3>
              <p className="text-gray-600">Reserve your spot in seconds with our lightning-fast booking system and real-time availability.</p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 hover:bg-primary-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-xl mb-3">Secure Transactions</h3>
              <p className="text-gray-600">Plan with confidence. Our enterprise-grade security ensures your data and bookings are always safe.</p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 hover:bg-primary-50 transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-xl mb-3">Global Reach</h3>
              <p className="text-gray-600">Discover events across the country or host your own for a worldwide audience effortlessly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
