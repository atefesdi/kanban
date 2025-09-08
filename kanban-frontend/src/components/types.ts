export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: number | undefined;
  created_by_id?: number;
  assigned_by_id?: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Column {
  id: number;
  title: string;
  tasks: Task[];
}

export interface loginResponse {
  user: {id: number, name: string, email: string,}
  message: string;
  token: string;
}
