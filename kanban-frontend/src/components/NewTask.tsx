import { useState } from 'react';
import { createTask} from "../api/task";
import { TaskStatus, type TaskInput, type Column } from "../types/types";
import styles from "./newTask.module.css"

const initialTask: TaskInput = { title: "", description: "", status: TaskStatus.ToDo };

interface NewTaskProps {
  activeColumn: number;
  setActiveColumn: (col: number) => void;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  columns: Column[];
  setTaskPopup: (arg0: boolean)=>void;
}

const NewTask = ({activeColumn, setActiveColumn, setColumns, columns, setTaskPopup}: NewTaskProps) => {
  const [newTask, setNewTask] = useState<TaskInput>(initialTask);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const addNewTask = async () => {
    setError(null)
    if (!newTask.title.trim()) {
      setError("Please enter a title");
      return
    }

    setLoading(true);

    try {
        const response = await createTask({
          ...newTask, status: activeColumn,
          id: 0
        });
        if (response?.id != null) {
          setColumns(prev => prev.map(col => col.id === activeColumn ? {...col, tasks: [...col.tasks, { ...response }] } : col))
          setNewTask(initialTask);
          setTaskPopup(false)
        }else{
          setError("Server did not return the created task.");
        }
      } catch (err) {
        console.error("Failed to create task:", err);
        setError("Failed to create task. Try again.");
      }finally {
      setLoading(false);
    }
    };

  return (
    <>
    <div className={styles.addTaskWrapper} onClick={()=> setTaskPopup(false)}></div>
      <div className={styles.addTaskForm}>
      <h4 className={styles.addTaskTitle}>Add New Task</h4>

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

        <label className={styles.selectLabel}>
          Move to
          <select
            value={activeColumn}
            onChange={(e) =>
              setActiveColumn(Number(e.target.value) as TaskStatus)
            }
            className={styles.addTaskSelect}
            aria-label="Select column"
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </label>

        {error && <div className={styles.errorText}>{error}</div>}

         <div className={styles.addTaskActions}>
          <button
            type="button"
            className={styles.addTaskCancelButton}
            onClick={()=> setTaskPopup(false)}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.addTaskButton}
            onClick={addNewTask}
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? (
              <span className={styles.buttonContent}>
                <span className={styles.spinner} aria-hidden="true" />
                Adding...
              </span>
            ) : (
              "Add Task"
            )}
          </button>
        </div>

    </div>
    </>
  )
}

export default NewTask
