import { UserType } from '@/types/user';

// Mock data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    displayName: 'Admin User',
    role: 'admin',
    phone: '555-123-4567',
  },
  {
    id: '2',
    email: 'employee@example.com',
    password: 'employee123',
    displayName: 'John Employee',
    role: 'employee',
    phone: '555-987-6543',
  },
];

// In a real app, these would use Firebase Authentication and Firestore

export const mockLogin = async (email: string, password: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Remove password before returning user data
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword as UserType,
    token: 'mock-jwt-token-' + userWithoutPassword.id,
  };
};

export const mockRegister = async (name: string, email: string, password: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingUser = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser = {
    id: (MOCK_USERS.length + 1).toString(),
    email,
    password,
    displayName: name,
    role: 'employee', // Default role is employee
    phone: '',
  };
  
  // Add to mock database (in a real app, this would be Firestore)
  MOCK_USERS.push(newUser);
  
  // Remove password before returning user data
  const { password: _, ...userWithoutPassword } = newUser;
  
  return {
    user: userWithoutPassword as UserType,
    token: 'mock-jwt-token-' + userWithoutPassword.id,
  };
};

export const mockLogout = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In real app, this would call Firebase signOut()
  return true;
};

export const fetchCurrentUser = async (): Promise<UserType> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, return a mock user
  // In a real app, this would use Firebase Auth to get the current user
  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: 'admin',
    phone: '555-123-4567',
  };
  
  return mockUser;
};