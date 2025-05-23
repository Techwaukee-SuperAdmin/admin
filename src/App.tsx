import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminList from './pages/admin/AdminList';
import AdminForm from './pages/admin/AdminForm';
import CandidateList from './pages/candidate/CandidateList';
import CandidateForm from './pages/candidate/CandidateForm';
import CompanyList from './pages/company/CompanyList';
import CompanyForm from './pages/company/CompanyForm';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/settings/Profile';
import Settings from './pages/settings/Settings';
import { ToastContainer } from 'react-toastify';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AuthenticatedApp = () => {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="admins">
            <Route index element={<AdminList />} />
            <Route path="new" element={<AdminForm />} />
            <Route path=":id" element={<AdminForm />} />
          </Route>
          
          <Route path="candidates">
            <Route index element={<CandidateList />} />
            <Route path="new" element={<CandidateForm />} />
            <Route path=":id" element={<CandidateForm />} />
          </Route>
          
          <Route path="companies">
            <Route index element={<CompanyList />} />
            <Route path="new" element={<CompanyForm />} />
            <Route path=":id" element={<CompanyForm />} />
          </Route>

          <Route path="settings">
            <Route index element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </DataProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AuthenticatedApp />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;