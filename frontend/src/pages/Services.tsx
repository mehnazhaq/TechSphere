import React, { useState, useEffect } from 'react';

interface Service {
  _id: string;
  name: string;
  description: string;
  pricing: number;
  pricingUnit: string;
  category: string;
  availabilityStatus: boolean;
  features: string[];
  createdAt: string;
}

interface NewServiceForm {
  name: string;
  description: string;
  pricing: string;
  pricingUnit: string;
  category: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<NewServiceForm>({
    name: '',
    description: '',
    pricing: '',
    pricingUnit: 'per month',
    category: 'Other',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      } else {
        setError(data.error || 'Failed to fetch services.');
      }
    } catch (err) {
      setError('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = () => {
    setFormData({ name: '', description: '', pricing: '', pricingUnit: 'per month', category: 'Other' });
    setFormError(null);
    setFormSuccess(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (!submitting) setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.name || !formData.description || !formData.pricing) {
      setFormError('Name, description, and pricing are required.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          pricing: parseFloat(formData.pricing),
        }),
      });
      const data = await response.json();

      if (data.success) {
        setFormSuccess(`Service "${formData.name}" created successfully!`);
        await fetchServices();
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess(null);
        }, 1500);
      } else {
        setFormError(data.error || 'Failed to create service.');
      }
    } catch (err) {
      setFormError('Error connecting to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      const data = await response.json();
      if (data.success) {
        await fetchServices();
      } else {
        alert(data.error || 'Failed to delete service.');
      }
    } catch (err) {
      alert('Error connecting to the server.');
    }
  };

  const categoryColor: Record<string, string> = {
    Cloud: 'bg-blue-100 text-blue-700',
    Security: 'bg-red-100 text-red-700',
    Networking: 'bg-indigo-100 text-indigo-700',
    Support: 'bg-green-100 text-green-700',
    DevOps: 'bg-orange-100 text-orange-700',
    Analytics: 'bg-purple-100 text-purple-700',
    Other: 'bg-gray-100 text-gray-700',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Services</h1>
          <p className="text-gray-500 mt-1">{services.length} service{services.length !== 1 ? 's' : ''} available</p>
        </div>
        <button
          id="add-service-btn"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Service
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No services found</p>
            <p className="text-sm mt-1">Click "Add Service" to create your first service.</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryColor[service.category] || categoryColor.Other}`}>
                  {service.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm flex-1">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-blue-600">
                  ${service.pricing.toFixed(2)}<span className="text-sm font-normal text-gray-400">/{service.pricingUnit.replace('per ', '')}</span>
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  service.availabilityStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${service.availabilityStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {service.availabilityStatus ? 'Active' : 'Inactive'}
                </span>
              </div>
              {service.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {service.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{feature}</span>
                  ))}
                  {service.features.length > 3 && (
                    <span className="text-gray-400 text-xs">+{service.features.length - 3} more</span>
                  )}
                </div>
              )}
              <button
                onClick={() => handleDelete(service._id)}
                className="w-full mt-auto bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add New Service</h2>
              <button onClick={handleCloseModal} disabled={submitting} className="text-gray-400 hover:text-gray-600 transition disabled:opacity-30">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{formSuccess}</div>
              )}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{formError}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Cloud Hosting" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe the service..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pricing ($) <span className="text-red-500">*</span></label>
                  <input type="number" name="pricing" value={formData.pricing} onChange={handleChange} required min="0" step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="99.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing</label>
                  <select name="pricingUnit" value={formData.pricingUnit} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="per month">Per Month</option>
                    <option value="per year">Per Year</option>
                    <option value="one-time">One-Time</option>
                    <option value="per user/month">Per User/Month</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="Cloud">Cloud</option>
                  <option value="Security">Security</option>
                  <option value="Networking">Networking</option>
                  <option value="Support">Support</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button type="button" onClick={handleCloseModal} disabled={submitting}
                  className="w-full sm:w-auto flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Saving...' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;