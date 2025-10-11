export const TaskStatus = {
  ToDo: 1,
  InProgress: 2,
  Done: 3,
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: number;
  created_by_id?: number;
  assigned_by_id?: number;
  creator?: User | null;
  assignee?: User | null;
 }

export interface Column {
  id: number;
  title: string;
  tasks: Task[];
}

export interface loginResponse {
  user: User
  message: string;
  token: string;
}


export type TaskInput = {
  title: string;
  description: string;
  status: number;
};

export const initialColumns: Column[] = [
  { id: TaskStatus.ToDo, title: "To Do", tasks: [] },
  { id: TaskStatus.InProgress, title: "In Progress", tasks: [] },
  { id: TaskStatus.Done, title: "Done", tasks: [] },
];
