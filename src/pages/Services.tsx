import React from 'react';

const Services: React.FC = () => {
  const services = [
    { name: 'Cloud Hosting', description: 'Scalable cloud hosting solutions', status: 'Active', price: '$99/month' },
    { name: 'IT Monitoring', description: '24/7 system monitoring and alerts', status: 'Active', price: '$49/month' },
    { name: 'Security Tools', description: 'Advanced cybersecurity protection', status: 'Inactive', price: '$149/month' },
    { name: 'Data Backup', description: 'Automated data backup and recovery', status: 'Active', price: '$29/month' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Services</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-blue-600">{service.price}</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {service.status}
              </span>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Manage
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;