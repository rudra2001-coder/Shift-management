import { NotificationType } from '@/types/notification';
import { addDays, subDays } from 'date-fns';

// Mock data
const MOCK_NOTIFICATIONS: NotificationType[] = [
  {
    id: '1',
    userId: '1',
    type: 'shift_assigned',
    message: 'You have been assigned a morning shift on Monday, June 10',
    read: false,
    shiftId: '1',
    createdAt: new Date().toISOString(),
    data: { shiftType: 'morning' },
  },
  {
    id: '2',
    userId: '1',
    type: 'vacation_response',
    message: 'Your vacation request for July 15-20 has been approved',
    read: true,
    requestId: '101',
    createdAt: subDays(new Date(), 2).toISOString(),
    data: { approved: true },
  },
  {
    id: '3',
    userId: '1',
    type: 'announcement',
    message: 'Company picnic scheduled for Saturday, July 15 at Central Park',
    read: false,
    createdAt: subDays(new Date(), 1).toISOString(),
    data: { title: 'Company Picnic' },
  },
  {
    id: '4',
    userId: '2',
    type: 'shift_changed',
    message: 'Your shift on Tuesday has been changed to night shift (16:00-00:00)',
    read: false,
    shiftId: '5',
    createdAt: new Date().toISOString(),
    data: { oldType: 'morning', newType: 'night' },
  },
];

// In a real app, these would use Firebase Firestore

export const fetchUserNotifications = async (userId: string): Promise<NotificationType[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter notifications by user and sort by date (newest first)
  const notifications = MOCK_NOTIFICATIONS
    .filter(notification => notification.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return notifications;
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
  
  if (index === -1) {
    throw new Error('Notification not found');
  }
  
  MOCK_NOTIFICATIONS[index].read = true;
  
  return true;
};

export const createNotification = async (notification: Omit<NotificationType, 'id' | 'createdAt'>): Promise<NotificationType> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const newNotification: NotificationType = {
    ...notification,
    id: (MOCK_NOTIFICATIONS.length + 1).toString(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  MOCK_NOTIFICATIONS.push(newNotification);
  
  return newNotification;
};