import React from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/ui/Card';
import { Users, UserCheck, Building2, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'increase', 
  linkTo
}: { 
  title: string;
  value: number;
  icon: React.ElementType;
  change: string;
  changeType?: 'increase' | 'decrease';
  linkTo: string;
}) => (
  <Card className="relative overflow-hidden">
    <div className="absolute top-0 right-0 pt-3 pr-4">
      <div className={`rounded-full p-2 ${
        changeType === 'increase' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="mt-1">
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      <div className="mt-2 flex items-center">
        {changeType === 'increase' ? 
          <ArrowUp className="h-4 w-4 text-green-600" /> : 
          <ArrowDown className="h-4 w-4 text-red-600" />
        }
        <span className={`ml-1 text-sm ${
          changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
        <Link to={linkTo} className="ml-auto text-sm text-indigo-600 hover:text-indigo-500">
          View all
        </Link>
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const { admins, candidates, companies, isLoading } = useData();
  
  // Calculate stats - in a real app, these would come from backend analytics
  const activeAdmins = admins.filter(a => a.status === 'active').length;
  const activeCandidates = candidates.filter(c => c.status !== 'rejected').length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  
  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your system's performance and status
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Admins"
          value={activeAdmins}
          icon={Users}
          change="12% from last month"
          changeType="increase"
          linkTo="/admins"
        />
        <StatCard
          title="Active Candidates"
          value={activeCandidates}
          icon={UserCheck}
          change="8% from last month"
          changeType="increase"
          linkTo="/candidates"
        />
        <StatCard
          title="Active Companies"
          value={activeCompanies}
          icon={Building2}
          change="3% from last month"
          changeType="decrease"
          linkTo="/companies"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Recent Activity"
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    {i % 3 === 0 ? <Users className="h-4 w-4" /> : 
                     i % 3 === 1 ? <UserCheck className="h-4 w-4" /> : 
                     <Building2 className="h-4 w-4" />}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {i % 3 === 0 ? "New admin user created" : 
                     i % 3 === 1 ? "Candidate status updated" : 
                     "New company registered"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(Date.now() - i * 3600000).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card
          title="Status Overview"
          className="lg:col-span-1"
        >
          <div className="h-60 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Analytics visualization would be displayed here
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;