import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Company } from '../../types';
import { Plus, Edit, Eye, Building2, Globe, Phone, MapPin, Calendar } from 'lucide-react';

const CompanyList = () => {
  const { companies, isLoading } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Search filter - now includes website and phone in searchable fields
  const filteredCompanies = companies.filter(
    company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.website && company.website.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.phone && company.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddNew = () => {
    navigate('/companies/new');
  };

  const handleEdit = (company: Company) => {
    navigate(`/companies/${company.id}`);
  };

  const handleViewClick = (e: React.MouseEvent, company: Company) => {
    e.stopPropagation();
    alert(`Viewing company details:\n\n` +
      `Name: ${company.name}\n` +
      `Industry: ${company.industry}\n` +
      `Founded: ${company.founded || 'N/A'}\n` +
      `Size: ${company.size}\n` +
      `Status: ${company.status}\n` +
      `Website: ${company.website || 'N/A'}\n` +
      `Email: ${company.email || 'N/A'}\n` +
      `Phone: ${company.phone || 'N/A'}\n` +
      `Address: ${company.address || 'N/A'}`);
  };

  const columns = [
    {
      key: 'name',
      header: 'Company',
      render: (company: Company) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-700" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{company.name}</div>
            <div className="text-sm text-gray-500">{company.industry}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'founded',
      header: 'Founded',
      render: (company: Company) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-500">
            {company.founded || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'website',
      header: 'Website',
      render: (company: Company) => (
        company.website ? (
          <div className="flex items-center">
            <Globe className="h-4 w-4 text-gray-400 mr-1" />
            <a 
              href={`https://${company.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {company.website}
            </a>
          </div>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )
      ),
    },
    {
      key: 'size',
      header: 'Size',
      render: (company: Company) => (
        <span className="text-sm text-gray-500">{company.size}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (company: Company) => (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          company.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {company.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (company: Company) => (
        <div>
          {company.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">{company.phone}</span>
            </div>
          )}
          {company.email && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {company.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (company: Company) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(company);
            }}
            leftIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => handleViewClick(e, company)}
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
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage company profiles and partnerships
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Company
        </Button>
      </div>

      <Table
        columns={columns}
        data={filteredCompanies}
        keyExtractor={(company) => company.id}
        isLoading={isLoading}
        onRowClick={handleEdit}
        searchPlaceholder="Search companies by name, industry, website or phone..."
        onSearch={handleSearch}
        emptyMessage="No companies found. Create one by clicking 'Add Company'."
      />
    </div>
  );
};

export default CompanyList;