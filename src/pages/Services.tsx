import React, { useState, useEffect } from 'react';

interface Service {
  _id: string;
  name: string;
  description: string;
  availabilityStatus: boolean;
  pricing: number;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricing: '',
    category: 'Other',
    availabilityStatus: true
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('You must be logged in to add a service.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          pricing: Number(formData.pricing),
          category: formData.category,
          availabilityStatus: formData.availabilityStatus
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setServices([data.data, ...services]);
        setIsAddModalOpen(false);
        setFormData({ name: '', description: '', pricing: '', category: 'Other', availabilityStatus: true });
      } else {
        setErrorMsg(data.error || 'Failed to add service');
      }
    } catch (err) {
      setErrorMsg('Network error occurred.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Services</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4 h-12 overflow-hidden">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-blue-600">${service.pricing}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  service.availabilityStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {service.availabilityStatus ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded hover:bg-blue-100 transition font-medium">
                Manage
              </button>
            </div>
          ))}
          {services.length === 0 && (
             <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
                No services found. Add one to get started!
             </div>
          )}
        </div>
      )}

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Add New Service</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6">
              {errorMsg && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
                   <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                  <span>{errorMsg}</span>
                </div>
              )}
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="e.g. Cloud Hosting" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" rows={3} placeholder="Describe the service..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pricing ($)</label>
                    <input type="number" required min="0" step="0.01" value={formData.pricing} onChange={(e) => setFormData({...formData, pricing: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white">
                      <option value="Cloud">Cloud</option>
                      <option value="Security">Security</option>
                      <option value="Networking">Networking</option>
                      <option value="Support">Support</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center pt-2">
                  <input type="checkbox" id="availability" checked={formData.availabilityStatus} onChange={(e) => setFormData({...formData, availabilityStatus: e.target.checked})} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="availability" className="ml-2 text-sm text-gray-700 font-medium">Available immediately?</label>
                </div>
                <div className="flex justify-end pt-4 mt-6 border-t border-gray-100 gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Add Service</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;