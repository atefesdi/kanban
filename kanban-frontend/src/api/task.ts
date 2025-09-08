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
