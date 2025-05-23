import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin, Candidate, Company } from '../types';
import { generateMockData } from '../utils/mockData';

interface DataContextType {
  admins: Admin[];
  candidates: Candidate[];
  companies: Company[];
  
  getAdmin: (id: string) => Admin | undefined;
  getCandidate: (id: string) => Candidate | undefined;
  getCompany: (id: string) => Company | undefined;
  
  addAdmin: (admin: Omit<Admin, 'id' | 'createdAt'>) => Admin;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt'>) => Candidate;
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => Company;
  
  updateAdmin: (id: string, admin: Partial<Admin>) => Admin | undefined;
  updateCandidate: (id: string, candidate: Partial<Candidate>) => Candidate | undefined;
  updateCompany: (id: string, company: Partial<Company>) => Company | undefined;
  
  deleteAdmin: (id: string) => boolean;
  deleteCandidate: (id: string) => boolean;
  deleteCompany: (id: string) => boolean;
  
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [candidates, setcandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Load mock data on initialization
  useEffect(() => {
    const mockData = generateMockData();
    setAdmins(mockData.admins);
    setcandidates(mockData.candidates);
    setCompanies(mockData.companies);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // CRUD operations for Admins
  const getAdmin = (id: string) => {
    return admins.find(admin => admin.id === id);
  };

  const addAdmin = (adminData: Omit<Admin, 'id' | 'createdAt'>) => {
    const newAdmin: Admin = {
      ...adminData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAdmins(prev => [...prev, newAdmin]);
    return newAdmin;
  };

  const updateAdmin = (id: string, adminData: Partial<Admin>) => {
    let updatedAdmin: Admin | undefined;
    
    setAdmins(prev => 
      prev.map(admin => {
        if (admin.id === id) {
          updatedAdmin = { ...admin, ...adminData };
          return updatedAdmin;
        }
        return admin;
      })
    );
    
    return updatedAdmin;
  };

  const deleteAdmin = (id: string) => {
    const initialLength = admins.length;
    setAdmins(prev => prev.filter(admin => admin.id !== id));
    return admins.length < initialLength;
  };

  // CRUD operations for Candidates
  const getCandidate = (id: string) => {
    return candidates.find(candidate => candidate.id === id);
  };

  const addCandidate = (candidateData: Omit<Candidate, 'id' | 'createdAt'>) => {
    const newCandidate: Candidate = {
      ...candidateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setcandidates(prev => [...prev, newCandidate]);
    return newCandidate;
  };

  const updateCandidate = (id: string, candidateData: Partial<Candidate>) => {
    let updatedCandidate: Candidate | undefined;
    
    setcandidates(prev => 
      prev.map(candidate => {
        if (candidate.id === id) {
          updatedCandidate = { ...candidate, ...candidateData };
          return updatedCandidate;
        }
        return candidate;
      })
    );
    
    return updatedCandidate;
  };

  const deleteCandidate = (id: string) => {
    const initialLength = candidates.length;
    setcandidates(prev => prev.filter(candidate => candidate.id !== id));
    return candidates.length < initialLength;
  };

  // CRUD operations for Companies
  const getCompany = (id: string) => {
    return companies.find(company => company.id === id);
  };

  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...companyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCompanies(prev => [...prev, newCompany]);
    return newCompany;
  };

  const updateCompany = (id: string, companyData: Partial<Company>) => {
    let updatedCompany: Company | undefined;
    
    setCompanies(prev => 
      prev.map(company => {
        if (company.id === id) {
          updatedCompany = { ...company, ...companyData };
          return updatedCompany;
        }
        return company;
      })
    );
    
    return updatedCompany;
  };

  const deleteCompany = (id: string) => {
    const initialLength = companies.length;
    setCompanies(prev => prev.filter(company => company.id !== id));
    return companies.length < initialLength;
  };

  return (
    <DataContext.Provider
      value={{
        admins,
        candidates,
        companies,
        getAdmin,
        getCandidate,
        getCompany,
        addAdmin,
        addCandidate,
        addCompany,
        updateAdmin,
        updateCandidate,
        updateCompany,
        deleteAdmin,
        deleteCandidate,
        deleteCompany,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};