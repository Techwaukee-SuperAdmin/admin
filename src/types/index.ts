export interface Admin {
  id: string;
  fullName: string;  // Changed from 'name' to match form field
  email: string;
  role: string;
  whatsAppNumber: string;
  employeeId: string;
  designation: string;
  officeAddress: string;
  profileImageUrl?: string;  // Optional since it might not always be present
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;  // Added location field (optional)
  status: 'new' | 'screening' | 'interview' | 'hired' | 'rejected';
  skills: string[];
  createdAt: string;
  updatedAt?: string;  // Optional field for tracking updates
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  founded?: string;  // Made optional with ?
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  size: string;
  status: 'active' | 'inactive';
  createdAt: string;
}