export interface UserType {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'employee';
  phone?: string;
}