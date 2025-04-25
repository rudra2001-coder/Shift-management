export interface NotificationType {
  id: string;
  userId: string;
  type: 'shift_assigned' | 'shift_changed' | 'vacation_response' | 'announcement';
  message: string;
  read: boolean;
  shiftId?: string;
  requestId?: string;
  createdAt: string; // ISO string
  data: Record<string, any>;
}