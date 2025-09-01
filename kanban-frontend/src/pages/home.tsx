import { getAllTasks } from "../api/task";
import KanbanBoard from "../components/KanbanBoard"
import { useEffect } from "react";

const Home = () => {


  useEffect(() => {

    const fetchData = async () => {
      try {
          const data = await getAllTasks();
        console.log('data :>> ', data);
      } catch (error: unknown) {
        console.log('error :>> ', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <h1>My Kanban Board</h1>
      <KanbanBoard/>
    </div>
  )
}

export default Home
