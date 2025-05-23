import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Users, Building2, UserCheck, LayoutDashboard, Menu, X, ChevronDown 
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, isActive, onClick }: {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-gray-900">AdminPro</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                  A
                </div>
                <span className="hidden md:inline">Admin User</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
               <Link to="/setting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <Link to="/Logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for mobile */}
        <div 
          className={`fixed inset-0 z-20 transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={closeSidebar}></div>
          <nav className="relative flex flex-col w-72 max-w-xs h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-1.5 rounded">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">AdminPro</span>
              </div>
              <button onClick={closeSidebar} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <NavItem 
                to="/"
                icon={LayoutDashboard}
                label="Dashboard"
                isActive={path === '/'}
                onClick={closeSidebar}
              />
              <NavItem 
                to="/admins"
                icon={Users}
                label="Admins"
                isActive={path.includes('/admins')}
                onClick={closeSidebar}
              />
              <NavItem 
                to="/candidates"
                icon={UserCheck}
                label="Candidates"
                isActive={path.includes('/candidates')}
                onClick={closeSidebar}
              />
              <NavItem 
                to="/companies"
                icon={Building2}
                label="Companies"
                isActive={path.includes('/companies')}
                onClick={closeSidebar}
              />
            </div>
          </nav>
        </div>

        {/* Sidebar for desktop */}
        <nav className="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <NavItem 
              to="/"
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={path === '/'}
            />
            <NavItem 
              to="/admins"
              icon={Users}
              label="Admins"
              isActive={path.includes('/admins')}
            />
            <NavItem 
              to="/candidates"
              icon={UserCheck}
              label="Candidates"
              isActive={path.includes('/candidates')}
            />
            <NavItem 
              to="/companies"
              icon={Building2}
              label="Companies"
              isActive={path.includes('/companies')}
            />
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;