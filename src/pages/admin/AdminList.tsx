import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Admin } from '../../types';
import { Plus, Edit, Eye, Phone, Briefcase, User } from 'lucide-react';

const AdminList = () => {
  const { admins, isLoading } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced search filter to include all fields
  const filteredAdmins = admins.filter(admin => {
    return Object.values(admin).some(value => {
      if (!value) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddNew = () => {
    navigate('/admins/new');
  };

  const handleEdit = (admin: Admin) => {
    navigate(`/admins/${admin.id}`);
  };

  const handleViewClick = (e: React.MouseEvent, admin: Admin) => {
    e.stopPropagation();
    alert(
      `Admin Details:\n\n` +
      `Name: ${admin.fullName}\n` +
      `Email: ${admin.email}\n` +
      `Role: ${admin.role}\n` +
      `Status: ${admin.status}\n` +
      `WhatsApp: ${admin.whatsAppNumber || 'N/A'}\n` +
      `Employee ID: ${admin.employeeId}\n` +
      `Designation: ${admin.designation}\n` +
      `Office Address: ${admin.officeAddress || 'N/A'}\n` +
      `Created At: ${new Date(admin.createdAt).toLocaleDateString()}`
    );
  };

  const columns = [
    {
      key: 'profile',
      header: 'Profile',
      render: (admin: Admin) => (
        <div className="flex items-center">
          {admin.profileImageUrl ? (
            <img 
              src={admin.profileImageUrl} 
              alt={admin.fullName}
              className="flex-shrink-0 h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-700" />
            </div>
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{admin.fullName}</div>
            <div className="text-sm text-gray-500">{admin.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (admin: Admin) => (
        <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
          {admin.role}
        </span>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (admin: Admin) => (
        <div className="flex items-center space-x-1">
          {admin.whatsAppNumber && (
            <span className="flex items-center text-sm text-gray-500">
              <Phone className="h-4 w-4 mr-1" />
              {admin.whatsAppNumber}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'employeeInfo',
      header: 'Employee Info',
      render: (admin: Admin) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
            <span>{admin.designation}</span>
          </div>
          <div className="text-xs text-gray-500">{admin.employeeId}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (admin: Admin) => (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          admin.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {admin.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (admin: Admin) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(admin);
            }}
            leftIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => handleViewClick(e, admin)}
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
          <h1 className="text-2xl font-semibold text-gray-900">Admins</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage administrator accounts and permissions
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Admin
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredAdmins}
        keyExtractor={(admin) => admin.id}
        isLoading={isLoading}
        onRowClick={handleEdit}
        searchPlaceholder="Search by name, email, role, etc..."
        onSearch={handleSearch}
        emptyMessage="No admins found. Create one by clicking 'Add Admin'."
      />
    </div>
  );
};

export default AdminList;