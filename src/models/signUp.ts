export interface User {
  id?: number; 
  username: string;
  email: string;
  password: string;
  date_of_birth?: string | null;
}
