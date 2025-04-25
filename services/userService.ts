import { UserType } from '@/types/user';

// Mock data - this would be handled by Firebase in a real app
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: 'admin',
    phone: '555-123-4567',
  },
  {
    id: '2',
    email: 'employee@example.com',
    displayName: 'John Employee',
    role: 'employee',
    phone: '555-987-6543',
  },
];

export const updateUserProfile = async (userId: string, userData: Partial<UserType>): Promise<UserType> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userIndex = MOCK_USERS.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user data
  const updatedUser = {
    ...MOCK_USERS[userIndex],
    ...userData,
  };
  
  MOCK_USERS[userIndex] = updatedUser;
  
  return updatedUser;
};

export const fetchUserById = async (userId: string): Promise<UserType | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const user = MOCK_USERS.find(user => user.id === userId);
  
  if (!user) {
    return null;
  }
  
  return user;
};

export const fetchUsers = async (): Promise<UserType[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return MOCK_USERS;
};