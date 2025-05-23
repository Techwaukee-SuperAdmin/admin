import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Candidate } from '../../types';
import { Plus, Edit, Eye, MapPin } from 'lucide-react';
// import { toast } from 'react-toastify';

const CandidateList = () => {
  const { candidates, isLoading } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Search filter - now includes location in search
  const filteredCandidates = candidates.filter(
    candidate => 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.location && candidate.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddNew = () => {
    navigate('/candidates/new');
  };

  const handleEdit = (candidate: Candidate) => {
    navigate(`/candidates/${candidate.id}`);
  };

  const handleViewClick = (e: React.MouseEvent, candidate: Candidate) => {
    e.stopPropagation();
    alert(`Viewing candidate:\n\nName: ${candidate.name}\nEmail: ${candidate.email}\nPhone: ${candidate.phone}\nLocation: ${candidate.location || 'Not specified'}\nStatus: ${candidate.status}\nSkills: ${candidate.skills.join(', ')}`);
  };

  // Status badge colors
  const statusColors: Record<string, { bg: string; text: string }> = {
    new: { bg: 'bg-blue-100', text: 'text-blue-800' },
    screening: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    interview: { bg: 'bg-purple-100', text: 'text-purple-800' },
    hired: { bg: 'bg-green-100', text: 'text-green-800' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (candidate: Candidate) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-700 font-medium">{candidate.name.charAt(0)}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
            <div className="text-sm text-gray-500">{candidate.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (candidate: Candidate) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-900">{candidate.phone}</div>
          {candidate.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {candidate.location}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (candidate: Candidate) => {
        const { bg, text } = statusColors[candidate.status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
        return (
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${bg} ${text}`}>
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'skills',
      header: 'Skills',
      render: (candidate: Candidate) => (
        <div className="flex flex-wrap gap-1">
          {candidate.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-800"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 3 && (
            <span className="text-xs text-gray-500">+{candidate.skills.length - 3} more</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (candidate: Candidate) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(candidate);
            }}
            leftIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => handleViewClick(e, candidate)}
            leftIcon={<Eye className="h-4 w-4" />}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage candidate profiles and application status
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Candidate
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredCandidates}
        keyExtractor={(candidate) => candidate.id}
        isLoading={isLoading}
        onRowClick={handleEdit}
        searchPlaceholder="Search candidates by name, email, location, or skills..."
        onSearch={handleSearch}
        emptyMessage="No candidates found. Create one by clicking 'Add Candidate'."
      />
    </div>
  );
};

export default CandidateList;