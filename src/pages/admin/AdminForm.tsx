import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';

interface AdminFormData {
  fullName: string;
  email: string;
  role: string;
  whatsAppNumber: string;
  employeeId: string;
  designation: string;
  officeAddress: string;
  profileImage: File | null;
  status: 'active' | 'inactive';
}

const AdminForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAdmin, addAdmin, updateAdmin, isLoading } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<AdminFormData>({
    fullName: '',
    email: '',
    role: '',
    whatsAppNumber: '',
    employeeId: '',
    designation: '',
    officeAddress: '',
    profileImage: null,
    status: 'active',
  });

  const [errors, setErrors] = useState<Partial<AdminFormData>>({});

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && !isLoading) {
      const admin = getAdmin(id);
      if (admin) {
        setFormData({
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
          whatsAppNumber: admin.whatsAppNumber,
          employeeId: admin.employeeId,
          designation: admin.designation,
          officeAddress: admin.officeAddress,
          profileImage: admin.profileImage,
          status: admin.status,
        });
        if (admin.profileImageUrl) {
          setImagePreview(admin.profileImageUrl);
        }
      } else {
        toast.error('Admin not found');
        navigate('/admins');
      }
    }
  }, [id, isLoading, getAdmin, navigate, isEditMode]);

  const validate = (): boolean => {
    const newErrors: Partial<AdminFormData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (formData.whatsAppNumber && !/^\+?[0-9\s\-]+$/.test(formData.whatsAppNumber)) {
      newErrors.whatsAppNumber = 'Invalid WhatsApp number';
    }
    
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
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
    if (errors[name as keyof AdminFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profileImage: 'File size must be less than 5MB',
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profileImage: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        const updated = updateAdmin(id, formData);
        if (updated) {
          toast.success('Admin updated successfully');
          navigate('/admins');
        } else {
          toast.error('Failed to update admin');
        }
      } else {
        addAdmin(formData);
        toast.success('Admin created successfully');
        navigate('/admins');
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
                  onClick={() => navigate('/admins')}
                  className="mr-4 p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-white">
                  {isEditMode ? 'Edit Admin' : 'Create New Admin'}
                </h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/admins')}
                  className="px-4 py-2 text-sm font-medium text-indigo-100 bg-indigo-700 bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="adminForm"
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
            <form id="adminForm" onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200">
                {/* Personal Details Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Details</h2>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Full Name Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.fullName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter full name"
                        />
                        {errors.fullName && (
                          <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
                        )}
                      </div>
                    </div>

                    {/* Role Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <div className="mt-1">
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.role ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Role</option>
                          
                          <option value="Admin">Admin</option>
                          <option value="Moderator">Moderator</option>
                        </select>
                        {errors.role && (
                          <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter email address"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="pt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Additional Information</h2>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* WhatsApp Number Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="whatsAppNumber" className="block text-sm font-medium text-gray-700">
                        WhatsApp Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id="whatsAppNumber"
                          name="whatsAppNumber"
                          value={formData.whatsAppNumber}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.whatsAppNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+1234567890"
                        />
                        {errors.whatsAppNumber && (
                          <p className="mt-2 text-sm text-red-600">{errors.whatsAppNumber}</p>
                        )}
                      </div>
                    </div>

                    {/* Employee ID Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                        Employee ID
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="employeeId"
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.employeeId ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="EMP-XXXX"
                        />
                        {errors.employeeId && (
                          <p className="mt-2 text-sm text-red-600">{errors.employeeId}</p>
                        )}
                      </div>
                    </div>

                    {/* Designation Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                        Designation
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="designation"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.designation ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., HR Manager"
                        />
                        {errors.designation && (
                          <p className="mt-2 text-sm text-red-600">{errors.designation}</p>
                        )}
                      </div>
                    </div>

                    {/* Office Address Field */}
                    <div className="sm:col-span-6">
                      <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700">
                        Office Address
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="officeAddress"
                          name="officeAddress"
                          rows={3}
                          value={formData.officeAddress}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.officeAddress ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter full office address"
                        />
                        {errors.officeAddress && (
                          <p className="mt-2 text-sm text-red-600">{errors.officeAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* Profile Image Field */}
                    <div className="sm:col-span-6">
                      <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                        Profile Image
                      </label>
                      <div className="mt-1">
                        <input
                          type="file"
                          id="profileImage"
                          name="profileImage"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                        />
                        {errors.profileImage && (
                          <p className="mt-2 text-sm text-red-600">{errors.profileImage}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">Maximum file size: 5MB</p>
                        {imagePreview && (
                          <div className="mt-2">
                            <img 
                              src={imagePreview} 
                              alt="Profile preview" 
                              className="h-32 w-32 rounded-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Field */}
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
                onClick={() => navigate('/admins')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="adminForm"
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

export default AdminForm;