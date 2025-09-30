import { useState } from 'react';
import { createTask} from "../api/task";
import { TaskStatus, type TaskInput, type Column } from "./types";
import styles from "./newTask.module.css"

const initialTask: TaskInput = { title: "", description: "", status: TaskStatus.ToDo };

interface NewTaskProps {
  activeColumn: number;
  setActiveColumn: (col: number) => void;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  columns: Column[];
}

const NewTask = ({activeColumn, setActiveColumn, setColumns, columns}: NewTaskProps) => {
  const [newTask, setNewTask] = useState<TaskInput>(initialTask);
  const [loading, setLoading] = useState(false);


  const addNewTask = async () => {
    if (!newTask.title.trim()) return;
    setLoading(true);

    try {
        const response = await createTask({ ...newTask, status: activeColumn });
        if (response?.id){
          setColumns(prev => prev.map(col => col.id === activeColumn ? {...col, tasks: [...col.tasks, { ...response }] } : col))
          setNewTask(initialTask);
        }
      } catch (error) {
        console.error("Failed to create task:", error);
      }finally {
      setLoading(false);
    }
    };

  return (
    <div className={styles.addTaskWrapper}>
      <h4 className={styles.addTaskTitle}>Add New Task</h4>

      <div className={styles.addTaskForm}>
        <input
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task title"
          className={styles.addTaskInput}
        />

        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task description"
          className={styles.addTaskTextarea}
        />

        <select
          value={activeColumn}
          onChange={(e) => setActiveColumn(Number(e.target.value) as TaskStatus)}
          className={styles.addTaskSelect}
        >
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>

        <button onClick={addNewTask} className={styles.addTaskButton}>
          {loading ? "Adding..." : "Add Task"}
        </button>
    </div>
    </div>
  )
}

export default NewTask
