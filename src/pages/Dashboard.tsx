import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState([
    { title: 'Total Clients', value: '...', change: '+12%' },
    { title: 'Active Subscriptions', value: '567', change: '+8%' },
    { title: 'Revenue Growth', value: '$45,678', change: '+15%' },
    { title: 'Open Support Tickets', value: '23', change: '-5%' },
  ]);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/users`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        const data = await response.json();
        if (data.success) {
          setMetrics(prev => prev.map(m => 
            m.title === 'Total Clients' ? { ...m, value: data.count.toString() } : m
          ));
        }
      } catch (err) {
        console.error('Error fetching user count:', err);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{metric.title}</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</p>
            <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {metric.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h3>
        <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart Placeholder - Performance Graph</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition duration-200">
          Add New Service
        </button>
        <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition duration-200">
          View Reports
        </button>
        <button className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition duration-200">
          Manage Clients
        </button>
      </div>
    </div>
  );
};

export default Dashboard;