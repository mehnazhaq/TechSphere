import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Ticket {
  _id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  userId: { _id: string; name: string; email: string } | null;
  assignedTo: { _id: string; name: string } | null;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalClients, setTotalClients] = useState<number | null>(null);
  const [totalServices, setTotalServices] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };

    const fetchAll = async () => {
      try {
        const [clientsRes, servicesRes, ticketsRes] = await Promise.allSettled([
          fetch('http://localhost:5000/api/clients', { headers }),
          fetch('http://localhost:5000/api/services', { headers }),
          fetch('http://localhost:5000/api/tickets', { headers }),
        ]);

        if (clientsRes.status === 'fulfilled') {
          const data = await clientsRes.value.json();
          if (data.success) setTotalClients(data.count);
        }

        if (servicesRes.status === 'fulfilled') {
          const data = await servicesRes.value.json();
          if (data.success) setTotalServices(data.count);
        }

        if (ticketsRes.status === 'fulfilled') {
          const data = await ticketsRes.value.json();
          if (data.success) setTickets(data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Ticket counts
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
  const closedTickets = tickets.filter(t => t.status === 'Closed').length;

  // Recent 5 tickets
  const recentTickets = tickets.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Resolved': return 'bg-green-500';
      case 'Closed': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Dashboard Overview</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Total Clients */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Clients</h3>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalClients ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">From clients collection</p>
        </div>

        {/* Total Services */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Services</h3>
            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalServices ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Active services</p>
        </div>

        {/* Open Tickets */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Open Tickets</h3>
            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{openTickets}</p>
          <p className="text-xs text-gray-400 mt-1">Needs attention</p>
        </div>

        {/* Total Tickets */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Tickets</h3>
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{tickets.length}</p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
      </div>

      {/* Ticket Status Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Open', count: openTickets, dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
          { label: 'In Progress', count: inProgressTickets, dot: 'bg-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700' },
          { label: 'Resolved', count: resolvedTickets, dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
          { label: 'Closed', count: closedTickets, dot: 'bg-gray-400', bg: 'bg-gray-50', text: 'text-gray-600' },
        ].map((item) => (
          <div key={item.label} className={`${item.bg} rounded-xl p-3 sm:p-4 border border-opacity-20`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`h-2 w-2 rounded-full ${item.dot}`}></span>
              <span className={`text-xs font-semibold ${item.text}`}>{item.label}</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${item.text}`}>{item.count}</p>
          </div>
        ))}
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2 sm:mb-0">Recent Tickets</h3>
          <button
            onClick={() => navigate('/dashboard/tickets')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
          >
            View All →
          </button>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          {recentTickets.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400">
              <p className="font-medium">No tickets yet</p>
              <p className="text-sm mt-1">Tickets will appear here once submitted.</p>
            </div>
          ) : (
            recentTickets.map((ticket) => (
              <div key={ticket._id} className="px-4 py-4 border-b border-gray-50 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900 flex-1 mr-2 truncate">{ticket.title}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(ticket.status)}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(ticket.status)}`}></span>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{ticket.userId?.name || 'Unknown'}</span>
                  <span>•</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                  <span>•</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <p className="font-medium">No tickets yet</p>
                    <p className="text-sm mt-1">Tickets will appear here once submitted.</p>
                  </td>
                </tr>
              ) : (
                recentTickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 truncate block max-w-[200px]" title={ticket.title}>
                        {ticket.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                          {ticket.userId?.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm text-gray-700">{ticket.userId?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(ticket.status)}`}></span>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/dashboard/services')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Service
        </button>
        <button
          onClick={() => navigate('/dashboard/tickets')}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
          </svg>
          View Tickets
        </button>
        <button
          onClick={() => navigate('/dashboard/clients')}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Manage Clients
        </button>
      </div>
    </div>
  );
};

export default Dashboard;