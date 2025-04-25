export interface ShiftType {
  id: string;
  userId: string;
  type: 'morning' | 'night' | 'homeoffice' | 'off';
  date: string; // ISO string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  location?: string;
  notes?: string;
}

export interface VacationRequestType {
  id: string;
  userId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string; // ISO string
  notes?: string;
}