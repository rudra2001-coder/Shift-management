import { ShiftType } from '@/types/shift';
import { format, addDays } from 'date-fns';

// Mock data
const MOCK_SHIFTS: ShiftType[] = [
  {
    id: '1',
    userId: '1',
    type: 'morning',
    date: new Date().toISOString(),
    startTime: '08:00',
    endTime: '16:00',
    location: 'Main Office',
    notes: 'Regular morning shift',
  },
  {
    id: '2',
    userId: '1',
    type: 'night',
    date: addDays(new Date(), 1).toISOString(),
    startTime: '16:00',
    endTime: '00:00',
    location: 'Main Office',
    notes: 'Night shift coverage',
  },
  {
    id: '3',
    userId: '1',
    type: 'homeoffice',
    date: addDays(new Date(), 3).toISOString(),
    startTime: '09:00',
    endTime: '17:00',
    location: 'Home Office',
    notes: 'Remote work day',
  },
  {
    id: '4',
    userId: '2',
    type: 'morning',
    date: new Date().toISOString(),
    startTime: '08:00',
    endTime: '16:00',
    location: 'Branch Office',
    notes: '',
  },
  {
    id: '5',
    userId: '2',
    type: 'homeoffice',
    date: addDays(new Date(), 2).toISOString(),
    startTime: '09:00',
    endTime: '17:00',
    location: 'Home Office',
    notes: '',
  },
];

// In a real app, these would use Firebase Firestore

export const fetchUserShifts = async (userId: string, limit?: number): Promise<ShiftType[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter shifts by user and sort by date
  let shifts = MOCK_SHIFTS.filter(shift => shift.userId === userId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Apply limit if provided
  if (limit) {
    shifts = shifts.slice(0, limit);
  }
  
  return shifts;
};

export const fetchShiftById = async (shiftId: string): Promise<ShiftType | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const shift = MOCK_SHIFTS.find(s => s.id === shiftId);
  return shift || null;
};

export const createShift = async (shiftData: Omit<ShiftType, 'id'>): Promise<ShiftType> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newShift: ShiftType = {
    ...shiftData,
    id: (MOCK_SHIFTS.length + 1).toString(),
  };
  
  MOCK_SHIFTS.push(newShift);
  
  return newShift;
};

export const updateShift = async (shiftId: string, shiftData: Partial<ShiftType>): Promise<ShiftType> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = MOCK_SHIFTS.findIndex(s => s.id === shiftId);
  
  if (index === -1) {
    throw new Error('Shift not found');
  }
  
  const updatedShift = {
    ...MOCK_SHIFTS[index],
    ...shiftData,
  };
  
  MOCK_SHIFTS[index] = updatedShift;
  
  return updatedShift;
};

export const deleteShift = async (shiftId: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = MOCK_SHIFTS.findIndex(s => s.id === shiftId);
  
  if (index === -1) {
    throw new Error('Shift not found');
  }
  
  MOCK_SHIFTS.splice(index, 1);
  
  return true;
};