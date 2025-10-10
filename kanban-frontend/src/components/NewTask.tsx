import { useState } from 'react';
import { TaskStatus, type TaskInput, type Column } from "../types/types";
import styles from "./newTask.module.css"
import { sendTaskAction , type TaskChannelSubscription} from '../websocket/tasks';

const initialTask: TaskInput = { title: "", description: "", status: TaskStatus.ToDo };

interface NewTaskProps {
  activeColumn: number;
  setActiveColumn: (col: number) => void;
  columns: Column[];
  setTaskPopup: (arg0: boolean)=>void;
  subscription: TaskChannelSubscription | null;
}

const NewTask = ({activeColumn, setActiveColumn, columns, setTaskPopup, subscription}: NewTaskProps) => {
  const [newTask, setNewTask] = useState<TaskInput>(initialTask);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const addNewTask =  () => {
    setError(null)
    if (!newTask.title.trim()) {
      setError("Please enter a title");
      return
    }

    setLoading(true);


       if (!subscription) {
    setError("No active connection");
    return;
  }

  try {
    setLoading(true);
    sendTaskAction(subscription, "create", {
      ...newTask,
      status: activeColumn,
    });

    setNewTask(initialTask);
    setTaskPopup(false);
  } catch (err) {
    console.error(err);
    setError("Failed to create task");
  } finally {
    setLoading(false);
  }
      setLoading(false);
    }


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
