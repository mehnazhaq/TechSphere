import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DashboardMetrics {
  totalClients: number;
  activeServices: number;
  openTickets: number;
  resolvedTickets: number;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    activeServices: 0,
    openTickets: 0,
    resolvedTickets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const [usersRes, servicesRes, ticketsRes] = await Promise.allSettled([
          fetch(`${import.meta.env.VITE_API_URL}/auth/users`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/services`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/tickets`, { headers }),
        ]);

        let totalClients = 0;
        let activeServices = 0;
        let openTickets = 0;
        let resolvedTickets = 0;
        let tickets: any[] = [];

        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
          const data = await usersRes.value.json();
          if (data.success) totalClients = data.count || data.data?.length || 0;
        }

        if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
          const data = await servicesRes.value.json();
          if (data.success) activeServices = data.count || data.data?.length || 0;
        }

        if (ticketsRes.status === 'fulfilled' && ticketsRes.value.ok) {
          const data = await ticketsRes.value.json();
          if (data.success) {
            tickets = data.data || [];
            openTickets = tickets.filter((t: any) => t.status === 'Open' || t.status === 'In Progress').length;
            resolvedTickets = tickets.filter((t: any) => t.status === 'Resolved' || t.status === 'Closed').length;
          }
        }

        setMetrics({ totalClients, activeServices, openTickets, resolvedTickets });
        setRecentTickets(tickets.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    { title: 'Total Clients', value: metrics.totalClients, icon: '👥', color: 'blue', link: '/dashboard/clients' },
    { title: 'Active Services', value: metrics.activeServices, icon: '⚙️', color: 'green', link: '/dashboard/services' },
    { title: 'Open Tickets', value: metrics.openTickets, icon: '🎫', color: 'yellow', link: '/dashboard/tickets' },
    { title: 'Resolved Tickets', value: metrics.resolvedTickets, icon: '✅', color: 'purple', link: '/dashboard/tickets' },
  ];

  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-200' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', ring: 'ring-yellow-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
  };

  const priorityColor: Record<string, string> = {
    Low: 'bg-blue-100 text-blue-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    High: 'bg-orange-100 text-orange-700',
    Critical: 'bg-red-100 text-red-700',
  };

  const statusColor: Record<string, string> = {
    Open: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-purple-100 text-purple-700',
    Closed: 'bg-gray-100 text-gray-700',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric, index) => {
          const colors = colorMap[metric.color];
          return (
            <Link
              to={metric.link}
              key={index}
              className={`bg-white p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ring-1 ${colors.ring} cursor-pointer block`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{metric.title}</h3>
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center text-xl`}>
                  {metric.icon}
                </div>
              </div>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className={`text-3xl font-bold ${colors.text}`}>{metric.value}</p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Recent Tickets */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Recent Tickets</h3>
          <Link to="/dashboard/tickets" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : recentTickets.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No tickets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTickets.map((ticket: any) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-xs truncate">{ticket.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[ticket.status] || ''}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColor[ticket.priority] || ''}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/dashboard/services"
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition duration-200 text-center font-semibold"
        >
          View Services
        </Link>
        <Link
          to="/dashboard/tickets"
          className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition duration-200 text-center font-semibold"
        >
          View Tickets
        </Link>
        <Link
          to="/dashboard/clients"
          className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition duration-200 text-center font-semibold"
        >
          Manage Clients
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;