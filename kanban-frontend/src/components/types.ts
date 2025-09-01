export type Task = {
  id: number;
  title: string;
  description?: string;
  assignedTo?: string;
};

export type Column = {
  id: number;
  title: string;
  tasks: Task[];
};
