import React, { useState, useEffect } from 'react';

interface TicketData {
  _id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  userId?: { name: string } | null;
}

interface AnalyticsData {
  totalUsers: number;
  activeServices: number;
  totalTickets: number;
  resolutionRate: number;
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  serviceCategoryBreakdown: Record<string, number>;
  recentTickets: TicketData[];
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
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

        let totalUsers = 0;
        let activeServices = 0;
        let serviceCategoryBreakdown: Record<string, number> = {};
        let tickets: TicketData[] = [];

        if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
          const d = await usersRes.value.json();
          if (d.success) totalUsers = d.count || d.data?.length || 0;
        }

        if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
          const d = await servicesRes.value.json();
          if (d.success) {
            const services = d.data || [];
            activeServices = services.filter((s: any) => s.availabilityStatus !== false).length;
            services.forEach((s: any) => {
              const cat = s.category || 'Other';
              serviceCategoryBreakdown[cat] = (serviceCategoryBreakdown[cat] || 0) + 1;
            });
          }
        }

        if (ticketsRes.status === 'fulfilled' && ticketsRes.value.ok) {
          const d = await ticketsRes.value.json();
          if (d.success) tickets = d.data || [];
        }

        const statusBreakdown: Record<string, number> = {};
        const priorityBreakdown: Record<string, number> = {};
        const categoryBreakdown: Record<string, number> = {};

        tickets.forEach((t) => {
          statusBreakdown[t.status] = (statusBreakdown[t.status] || 0) + 1;
          priorityBreakdown[t.priority] = (priorityBreakdown[t.priority] || 0) + 1;
          categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + 1;
        });

        const resolved = (statusBreakdown['Resolved'] || 0) + (statusBreakdown['Closed'] || 0);
        const resolutionRate = tickets.length > 0 ? Math.round((resolved / tickets.length) * 100) : 0;

        setData({
          totalUsers,
          activeServices,
          totalTickets: tickets.length,
          resolutionRate,
          statusBreakdown,
          priorityBreakdown,
          categoryBreakdown,
          serviceCategoryBreakdown,
          recentTickets: tickets.slice(0, 10),
        });
      } catch (err) {
        setError('Failed to load analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statusColors: Record<string, { bg: string; text: string; bar: string }> = {
    Open: { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' },
    'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
    Resolved: { bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500' },
    Closed: { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-400' },
  };

  const priorityColors: Record<string, { bg: string; text: string; bar: string }> = {
    Low: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
    Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' },
    High: { bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' },
    Critical: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' },
  };

  const categoryColors: Record<string, string> = {
    Technical: 'bg-indigo-500',
    Billing: 'bg-emerald-500',
    General: 'bg-sky-500',
    'Feature Request': 'bg-amber-500',
    Bug: 'bg-rose-500',
  };

  const serviceCatColors: Record<string, string> = {
    Cloud: 'bg-blue-500',
    Security: 'bg-red-500',
    Networking: 'bg-indigo-500',
    Support: 'bg-green-500',
    DevOps: 'bg-orange-500',
    Analytics: 'bg-purple-500',
    Other: 'bg-gray-500',
  };

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  // Build donut chart CSS from status breakdown
  const buildDonutGradient = (): string => {
    if (!data || data.totalTickets === 0) return 'conic-gradient(#e5e7eb 0deg 360deg)';
    const order = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const colors: Record<string, string> = {
      Open: '#22c55e',
      'In Progress': '#3b82f6',
      Resolved: '#a855f7',
      Closed: '#9ca3af',
    };
    let accumulated = 0;
    const segments: string[] = [];
    order.forEach((status) => {
      const count = data.statusBreakdown[status] || 0;
      const pct = (count / data.totalTickets) * 100;
      if (pct > 0) {
        segments.push(`${colors[status]} ${accumulated}% ${accumulated + pct}%`);
        accumulated += pct;
      }
    });
    // Fill remaining if any statuses are missing
    if (accumulated < 100) {
      segments.push(`#e5e7eb ${accumulated}% 100%`);
    }
    return `conic-gradient(${segments.join(', ')})`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md h-28 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error || 'No data available.'}
      </div>
    );
  }

  const summaryCards = [
    { title: 'Total Users', value: data.totalUsers, icon: '👥', color: 'blue' },
    { title: 'Active Services', value: data.activeServices, icon: '⚙️', color: 'green' },
    { title: 'Total Tickets', value: data.totalTickets, icon: '🎫', color: 'yellow' },
    { title: 'Resolution Rate', value: `${data.resolutionRate}%`, icon: '✅', color: 'purple' },
  ];

  const cardColors: Record<string, { ring: string; bg: string; text: string }> = {
    blue: { ring: 'ring-blue-200', bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { ring: 'ring-green-200', bg: 'bg-green-50', text: 'text-green-600' },
    yellow: { ring: 'ring-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-600' },
    purple: { ring: 'ring-purple-200', bg: 'bg-purple-50', text: 'text-purple-600' },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 mt-1">Overview of your platform performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => {
          const c = cardColors[card.color];
          return (
            <div key={idx} className={`bg-white p-6 rounded-xl shadow-md ring-1 ${c.ring} transition-all hover:shadow-lg hover:-translate-y-0.5`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{card.title}</h3>
                <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center text-xl`}>{card.icon}</div>
              </div>
              <p className={`text-3xl font-bold ${c.text}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Donut Chart — Tickets by Status */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Tickets by Status</h3>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="relative flex-shrink-0">
              <div
                className="w-32 h-32 rounded-full"
                style={{ background: buildDonutGradient() }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-xl font-bold text-gray-800">{data.totalTickets}</span>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-2.5 flex-1">
              {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => {
                const count = data.statusBreakdown[status] || 0;
                const sc = statusColors[status];
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${sc.bar}`}></div>
                      <span className="text-sm text-gray-600">{status}</span>
                    </div>
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bar Chart — Tickets by Priority */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Tickets by Priority</h3>
          <div className="space-y-4">
            {['Critical', 'High', 'Medium', 'Low'].map((priority) => {
              const count = data.priorityBreakdown[priority] || 0;
              const pct = data.totalTickets > 0 ? (count / data.totalTickets) * 100 : 0;
              const pc = priorityColors[priority];
              return (
                <div key={priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{priority}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${pc.bar} h-2.5 rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar Chart — Tickets by Category */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Tickets by Category</h3>
          <div className="space-y-4">
            {['Technical', 'Billing', 'General', 'Feature Request', 'Bug'].map((cat) => {
              const count = data.categoryBreakdown[cat] || 0;
              const pct = data.totalTickets > 0 ? (count / data.totalTickets) * 100 : 0;
              const barColor = categoryColors[cat] || 'bg-gray-500';
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                    <span className="text-xs font-bold text-gray-500">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${barColor} h-2.5 rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activity Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Recent Activity</h3>
          {data.recentTickets.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No tickets yet.</p>
          ) : (
            <div className="space-y-0">
              {data.recentTickets.map((ticket, idx) => {
                const sc = statusColors[ticket.status] || statusColors['Open'];
                return (
                  <div key={ticket._id} className="flex gap-4 group">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${sc.bar} ring-4 ring-white flex-shrink-0 mt-1.5 group-hover:scale-125 transition-transform`}></div>
                      {idx < data.recentTickets.length - 1 && (
                        <div className="w-0.5 bg-gray-200 flex-1 min-h-[24px]"></div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-5 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{ticket.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{ticket.status}</span>
                        <span className="text-xs text-gray-400">{timeAgo(ticket.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Service Categories */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Services by Category</h3>
          {Object.keys(data.serviceCategoryBreakdown).length === 0 ? (
            <p className="text-gray-400 text-center py-8">No services yet.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(data.serviceCategoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => {
                  const total = Object.values(data.serviceCategoryBreakdown).reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  const barColor = serviceCatColors[cat] || 'bg-gray-500';
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${barColor}`}></div>
                          <span className="text-sm font-medium text-gray-700">{cat}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-600">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className={`${barColor} h-3 rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
                          style={{ width: `${Math.max(pct, 8)}%` }}
                        >
                          <span className="text-[9px] font-bold text-white">{Math.round(pct)}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;