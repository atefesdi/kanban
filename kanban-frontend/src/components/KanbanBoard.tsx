// KanbanBoard.tsx
import {TaskStatus, type Column, type Task } from "./types";
import { getAllTasks , deleteTask, editTask} from "../api/task";
import { useEffect, useState } from "react";
import styles from "./KanbanBoard.module.css";
import NewTask from "./NewTask";

const initialColumns: Column[] = [
  { id: TaskStatus.ToDo, title: "To Do", tasks: [] },
  { id: TaskStatus.InProgress, title: "In Progress", tasks: [] },
  { id: TaskStatus.Done, title: "Done", tasks: [] },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [taskPooup, setTaskPopup] = useState(false);
  const [activeColumn, setActiveColumn] = useState(1);
  const [dragInfo, setDragInfo] = useState<Task|null>(null);
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasks = await getAllTasks();
        console.log('tasks :>> ', tasks);
        if (!tasks || tasks.length === 0) return;
        const updatedColumns: Column[]  = initialColumns.map((c) => ({ ...c, tasks: [] }));
        tasks.forEach((task) => {
          const colIndex = updatedColumns.findIndex(col => col.id === (task.status ?? TaskStatus.ToDo));
          if (colIndex >= 0) updatedColumns[colIndex].tasks.push(task);
        });
          setColumns(updatedColumns);

      } catch (error: unknown) {
        console.log("error :>> ", error);
      }
    };
    fetchData();
  }, []);



  const removeTask = async(taskId: number, columnId: number) => {
    try {
      const result = await deleteTask(taskId);
      if (result?.message === 'Task deleted successfully') {
        const updatedColumns = columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      );
      setColumns(updatedColumns);
    }
    } catch {
      console.error("Failed to delete task from server.");
    }
  };

  const handleDragStart =(task:Task)=>{
    setDragInfo(task);
  }

  const handleDrop = async (columnId:number)=>{
    if (!dragInfo) return
    const updatedColumns = columns.map(((col) =>
      col.tasks.find( t => t.id === dragInfo.id) ? {...col, tasks: col.tasks.filter((t) => t.id !== dragInfo.id)} :col
    ))

    const targetIndex = updatedColumns.findIndex((col) => col.id === columnId)
    const updatedTask = {...dragInfo, status: columnId }
    if (targetIndex >= 0) {
      updatedColumns[targetIndex].tasks.push(updatedTask);
    }

    try {
    const data = await editTask(updatedTask)
    console.log('data :>> ', data);
    } catch (error) {
      console.log('error :>> ', error);
    }
    setColumns(updatedColumns);
    setDragInfo(null);


  }

  return (
    <>
    <button onClick={()=> setTaskPopup(true)}>Add New Task</button>
   {taskPooup && <NewTask activeColumn={activeColumn} setActiveColumn={setActiveColumn} setColumns={setColumns} columns={columns}/>}
    <div className={styles.boardWrapper}>
      <div className={styles.board}>
        {columns.map((column) => (
          <div key={column.id}
          onDragOver={(e)=>{
            e.preventDefault()
            setHoverColumn(column.id)
          }}
          onDragLeave={() => setHoverColumn(null)}
          onDrop={() => { handleDrop(column.id); setHoverColumn(null); }}
          className={`${styles.column} ${hoverColumn === column.id ? styles.columnHover : ""}`}>

            <h3 className={styles.columnTitle}>{column.title}</h3>
            {column.tasks.map((task) => (
              <div key={task.id} className={styles.task} draggable
              onDragStart={(e)=>{
                handleDragStart(task)
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragEnd={() => setDragInfo(null)}>
                <div className={styles.taskContent}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  {task.description && (
                    <span className={styles.taskDescription}>{task.description}</span>
                  )}
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeTask(task.id, column.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default KanbanBoard;
