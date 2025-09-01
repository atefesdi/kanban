import api from "./api";

 interface Task {
  id: number;
  title: string;
  description: string;
  created_by_id: number;
  assigned_by_id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}


export const getAllTasks = async () : Promise<Task[]> => {

  const response = await api.get("/tasks")

  console.log('response :>> ', response);

  return response.data;
}
