import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const getNavigation = () => {
    const base = [
      { name: 'Home', href: '/' },
      { name: 'Events', href: '/dashboard' },
    ];
    if (user?.role === 'admin') {
      base.push({ name: 'Manage', href: '/admin' });
    } else if (user) {
      base.push({ name: 'My Bookings', href: '/bookings' });
    }
    return base;
  };

  const navigation = getNavigation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-morphism py-4 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary-600 p-2 rounded-lg text-white group-hover:rotate-12 transition-transform">
            <Calendar size={24} />
          </div>
          <span className="text-2xl font-bold font-outfit tracking-tight">
            Event<span className="text-primary-600">ify</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-full border border-primary-100">
                  <UserIcon size={18} className="text-primary-600" />
                  <span className="text-sm font-bold text-gray-700">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="text-[10px] bg-primary-600 text-white px-1.5 rounded uppercase">Admin</span>
                  )}
               </div>
               <button 
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
               >
                  <LogOut size={20} />
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-5 py-2 text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="px-5 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-100">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium ${
                isActive(item.href) ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <hr className="border-gray-50 my-2" />
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 font-bold text-primary-600">
                <UserIcon size={20} /> {user.name} ({user.role})
              </div>
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="flex items-center gap-2 text-red-500 font-bold"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary text-center">Log In</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
