import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import ChatbotWidget from './Chatbot/ChatbotWidget';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/dashboard/clients', label: 'Clients', icon: '👥' },
    { path: '/dashboard/services', label: 'Services', icon: '⚙️' },
    { path: '/dashboard/subscriptions', label: 'Subscriptions', icon: '📋' },
    { path: '/dashboard/tickets', label: 'Tickets', icon: '🎫' },
    { path: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
    { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg ${sidebarOpen ? 'block' : 'hidden'} md:block md:w-64 w-full fixed md:static inset-y-0 left-0 z-50`}>
        <div className="flex items-center justify-center h-16 bg-blue-600">
          <h1 className="text-white text-xl font-bold">TechSphere</h1>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-200 ${
                location.pathname === item.path ? 'bg-blue-100 text-blue-600' : ''
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            ☰
          </button>
          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">🔔</button>
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  U
                </div>
                <span className="ml-2 hidden md:block">User</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">Settings</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
};

export default DashboardLayout;