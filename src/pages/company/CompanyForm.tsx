import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

interface CompanyFormData {
  name: string;
  industry: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  size: string;
  status: 'active' | 'inactive';
}

const CompanyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCompany, addCompany, updateCompany, isLoading } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    industry: '',
    founded: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    size: '100-499',
    status: 'active',
  });

  const [errors, setErrors] = useState<Partial<CompanyFormData>>({});

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && !isLoading) {
      const company = getCompany(id);
      if (company) {
        setFormData({
          name: company.name,
          industry: company.industry,
          founded: company.founded || '',
          website: company.website || '',
          email: company.email || '',
          phone: company.phone || '',
          address: company.address || '',
          size: company.size || '100-499',
          status: company.status || 'active',
        });
      } else {
        toast.error('Company not found');
        navigate('/companies');
      }
    }
  }, [id, isLoading, getCompany, navigate, isEditMode]);

  const validate = (): boolean => {
    const newErrors: Partial<CompanyFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is changed
    if (errors[name as keyof CompanyFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const updated = updateCompany(id, formData);
        if (updated) {
          toast.success('Company updated successfully');
          navigate('/companies');
        } else {
          toast.error('Failed to update company');
        }
      } else {
        addCompany(formData);
        toast.success('Company created successfully');
        navigate('/companies');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/companies')}
                  className="mr-4 p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-white">
                  {isEditMode ? 'Edit Company' : 'Create New Company'}
                </h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/companies')}
                  className="px-4 py-2 text-sm font-medium text-indigo-100 bg-indigo-700 bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="companyForm"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors duration-200 flex items-center"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                  )}
                  {isEditMode ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8">
            <form id="companyForm" onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200">
                {/* Company Details Section */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Company Name */}
                    <div className="sm:col-span-6">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Company Name *
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter company name"
                          required
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">Required field</p>
                      </div>
                    </div>

                    {/* Industry */}
                    <div className="sm:col-span-3">
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                        Industry
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          placeholder="e.g. Technology, Finance"
                        />
                      </div>
                    </div>

                    {/* Founded Year */}
                    <div className="sm:col-span-3">
                      <label htmlFor="founded" className="block text-sm font-medium text-gray-700">
                        Founded Year
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          id="founded"
                          name="founded"
                          value={formData.founded}
                          onChange={handleChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className="block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          placeholder="YYYY"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div className="sm:col-span-3">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          https://
                        </span>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          placeholder="yourcompany.com"
                        />
                      </div>
                    </div>

                    {/* Company Size */}
                    <div className="sm:col-span-3">
                      <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        Company Size
                      </label>
                      <div className="mt-1">
                        <select
                          id="size"
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="1-49">1-49 employees</option>
                          <option value="50-99">50-99 employees</option>
                          <option value="100-499">100-499 employees</option>
                          <option value="500-999">500-999 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="pt-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Email */}
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          placeholder="contact@company.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="address"
                          name="address"
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                          className="block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          placeholder="Street, City, State, ZIP Code"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="status-active"
                            name="status"
                            value="active"
                            checked={formData.status === 'active'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <label htmlFor="status-active" className="ml-3 block text-sm font-medium text-gray-700">
                            Active
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="status-inactive"
                            name="status"
                            value="inactive"
                            checked={formData.status === 'inactive'}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <label htmlFor="status-inactive" className="ml-3 block text-sm font-medium text-gray-700">
                            Inactive
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Mobile Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 sm:hidden">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate('/companies')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="companyForm"
                disabled={isSubmitting}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Save className="-ml-1 mr-2 h-4 w-4" />
                )}
                {isEditMode ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;