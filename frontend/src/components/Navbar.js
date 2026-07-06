import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUserRole(localStorage.getItem('role'));
    setUserName(localStorage.getItem('userName'));
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/admin/reports', label: 'Manage Reports' },
    { to: '/admin/map', label: 'Map View' },
    { to: '/admin/manage-admins', label: 'Manage Admins' },
  ];

  const userLinks = [
    { to: '/', label: 'Home' },
    { to: '/report', label: 'Report Waste' },
    { to: '/my-reports', label: 'My Reports' },
  ];

  const links = userRole === 'admin' ? adminLinks : userLinks;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'} bg-white border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to={userRole === 'admin' ? '/dashboard' : '/'} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl">♻️</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">SmartWaste</span>
              <span className="hidden sm:inline text-sm text-green-600 font-semibold ml-1.5">Management</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isLoggedIn ? (
              <>
                {links.map(({ to, label }) => (
                  <Link key={to} to={to}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${isActive(to) ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                    {label}
                  </Link>
                ))}
                <div className="ml-4 flex items-center gap-4 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800 leading-tight">{userName}</p>
                    <p className="text-xs text-green-600 capitalize font-semibold">{userRole}</p>
                  </div>
                  <button onClick={handleLogout}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-lg text-sm font-semibold transition border border-red-100">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-green-600 transition">
                  Login
                </Link>
                <Link to="/admin/login" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition shadow-sm">
                  Admin
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-100 pt-3 space-y-1">
            {isLoggedIn ? (
              <>
                {links.map(({ to, label }) => (
                  <Link key={to} to={to}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition ${isActive(to) ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {label}
                  </Link>
                ))}
                <div className="flex items-center justify-between px-4 py-2 mt-2 border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{userName}</p>
                    <p className="text-xs text-green-600 capitalize">{userRole}</p>
                  </div>
                  <button onClick={handleLogout}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold border border-red-100">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Login</Link>
                <Link to="/admin/login" className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-purple-600 hover:bg-purple-50">Admin Login</Link>
                <Link to="/register" className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-green-600 hover:bg-green-50">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
