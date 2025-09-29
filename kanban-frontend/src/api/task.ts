import axios from "axios";
import api from "./api";
import type { Task } from "../components/types";


export const getAllTasks = async () : Promise<Task[]> => {
  try {
    const response = await api.get("/tasks")
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)){
      console.error("get tasks failed", err.response?.data || err.message);
    }else{
      console.error( "get tasks failed", err );
    }
    throw err
  }
}


export const createTask = async (task: Task)  =>{
  try{
    const response  = await api.post("/tasks", task)
    return response.data;
  }catch(err : unknown){
    if(axios.isAxiosError(err)){
      console.error("create task is failed", err.response?.data || err.message)
    }else{
      console.error ("create task failed", err );
    }
  }
}


export const deleteTask = async (taskId: number) : Promise<{message : string} | undefined> => {

  try{
   const response = await api.delete<{message : string}>(`/tasks/${taskId}`)
   return response.data
  }catch(err: unknown){
   console.error ("delete task failed", axios.isAxiosError(err) ? err.response?.data || err.message : err );
  }
}
