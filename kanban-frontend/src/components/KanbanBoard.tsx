// KanbanBoard.tsx
import {TaskStatus, type Column, type Task, type TaskInput } from "./types";
import { getAllTasks , createTask, deleteTask} from "../api/task";
import { useEffect, useState } from "react";
import styles from "./KanbanBoard.module.css";

const initialColumns: Column[] = [
  { id: TaskStatus.ToDo, title: "To Do", tasks: [] },
  { id: TaskStatus.InProgress, title: "In Progress", tasks: [] },
  { id: TaskStatus.Done, title: "Done", tasks: [] },
];

const initialTask: TaskInput = { title: "", description: "", status: TaskStatus.ToDo };

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [newTask, setNewTask] = useState<TaskInput>(initialTask);
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


  const buildTask =(task:TaskInput, statusTask:TaskStatus) => ({
    ...task,
    status: statusTask,
    id: Math.random()
  })

  const addNewTask = async () => {

    if (!newTask.title.trim()) return;
    const taskToAdd = buildTask(newTask, TaskStatus.InProgress);

    setColumns(prev => prev.map(col => col.id === activeColumn ? {...col, tasks: [...col.tasks, taskToAdd] } : col))
    setNewTask(initialTask);

    try {
      const response = await createTask(taskToAdd);
      if (response?.id){
        setColumns(prev => prev.map(col => ({...col, tasks : col.tasks.map(task =>
          task.id === taskToAdd.id ? {...task, id: response.id} : task
         )})))

      }
    } catch (error) {
      console.error("Failed to create task:", error);

      setColumns((prev) =>
      prev.map((col) =>
        col.id === activeColumn
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskToAdd.id) }
          : col
      )
    );
    }

  };

  const removeTask = async(taskId: number, columnId: number) => {
    const updatedColumns = columns.map((col) =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
        : col
    );
    setColumns(updatedColumns);

    try {
    const result = await deleteTask(taskId);
    console.log(result?.message);
    } catch {
      console.error("Failed to delete task from server.");
    }
  };

  const handleDragStart =(task:Task)=>{
    setDragInfo(task);
  }

  const handleDrop = (columnId:number)=>{
    if (!dragInfo) return
    const updatedColumns = columns.map(((col) =>
      col.tasks.find( t => t.id === dragInfo.id) ? {...col, tasks: col.tasks.filter((t) => t.id !== dragInfo.id)} :col
    ))

    const targetIndex = updatedColumns.findIndex((col) => col.id === columnId)
    if (targetIndex >= 0) {
      updatedColumns[targetIndex].tasks.push({...dragInfo, status: columnId });
    }

    setColumns(updatedColumns);
    setDragInfo(null);
  }

  return (
    <div className={styles.boardWrapper}>
      {/* Controls */}
      <div className={styles.controls}>
        <select
          value={activeColumn}
          onChange={(e) => setActiveColumn(Number(e.target.value) as TaskStatus)}
          className={styles.select}
        >
          {columns.map((col) => (
            <option key={col.id}  value={col.id}>
              {col.title}
            </option>
          ))}
        </select>

        <input
          value={newTask.title}
          onChange={(e) => setNewTask({
            ...newTask,
            title: e.target.value
          })}
          placeholder="Add new task..."
          className={styles.input}
        />
        <button onClick={addNewTask} className={styles.button}>
          Add
        </button>
      </div>

      {/* Board */}
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
                <span>{task.title}</span>
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
  );
};

export default KanbanBoard;
