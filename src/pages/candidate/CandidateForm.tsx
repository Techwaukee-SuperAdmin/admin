import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, X } from 'lucide-react';

interface CandidateFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'new' | 'screening' | 'interview' | 'hired' | 'rejected';
  skills: string[];
}

const CandidateForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCandidate, addCandidate, updateCandidate, isLoading } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    status: 'new',
    skills: [],
  });

  const [errors, setErrors] = useState<Partial<CandidateFormData> & { skill?: string }>({});

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && !isLoading) {
      const candidate = getCandidate(id);
      if (candidate) {
        setFormData({
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          location: candidate.location || '',
          status: candidate.status,
          skills: [...candidate.skills],
        });
      } else {
        toast.error('Candidate not found');
        navigate('/candidates');
      }
    }
  }, [id, isLoading, getCandidate, navigate, isEditMode]);

  const validate = (): boolean => {
    const newErrors: Partial<CandidateFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is changed
    if (errors[name as keyof CandidateFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      setErrors(prev => ({ ...prev, skill: 'Skill cannot be empty' }));
      return;
    }
    
    if (formData.skills.includes(newSkill.trim())) {
      setErrors(prev => ({ ...prev, skill: 'Skill already exists' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }));
    
    setNewSkill('');
    setErrors(prev => ({ ...prev, skill: undefined }));
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
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
        const updated = updateCandidate(id, formData);
        if (updated) {
          toast.success('Candidate updated successfully');
          navigate('/candidates');
        } else {
          toast.error('Failed to update candidate');
        }
      } else {
        addCandidate(formData);
        toast.success('Candidate created successfully');
        navigate('/candidates');
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
                  onClick={() => navigate('/candidates')}
                  className="mr-4 p-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-white">
                  {isEditMode ? 'Edit Candidate' : 'Create New Candidate'}
                </h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/candidates')}
                  className="px-4 py-2 text-sm font-medium text-indigo-100 bg-indigo-700 bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="candidateForm"
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
            <form id="candidateForm" onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Name Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
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
                          placeholder="Enter full name"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
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

                    {/* Phone Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="(123) 456-7890"
                        />
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Location Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="pt-8">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Status Field */}
                    <div className="sm:col-span-3">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="new">New</option>
                          <option value="screening">Screening</option>
                          <option value="interview">Interview</option>
                          <option value="hired">Hired</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Skills Field */}
                    <div className="sm:col-span-6">
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                        Skills
                      </label>
                      <div className="mt-1">
                        <div className="flex">
                          <input
                            type="text"
                            id="skills"
                            value={newSkill}
                            onChange={(e) => {
                              setNewSkill(e.target.value);
                              if (errors.skill) {
                                setErrors(prev => ({ ...prev, skill: undefined }));
                              }
                            }}
                            onKeyPress={handleSkillKeyPress}
                            className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                              errors.skill ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., JavaScript"
                          />
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Add
                          </button>
                        </div>
                        {errors.skill && (
                          <p className="mt-2 text-sm text-red-600">{errors.skill}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                            >
                              {skill}
                              <button
                                type="button"
                                className="ml-1 inline-flex items-center justify-center rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-300 h-4 w-4"
                                onClick={() => handleRemoveSkill(skill)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                          {formData.skills.length === 0 && (
                            <p className="text-sm text-gray-500">No skills added yet</p>
                          )}
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
                onClick={() => navigate('/candidates')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="candidateForm"
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

export default CandidateForm;