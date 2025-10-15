// src/components/board/NewTaskForm.tsx
import { useState } from "react";
import {
  TaskStatus,
  type TaskInput,
  type Column,
  initialColumns,
} from "../../types/types";
import styles from "./newTaskForm.module.css";
import { sendTaskAction } from "../../websocket/tasks";
import { useTaskWebSocket } from "../../context/TaskWebSocketContext";
import { useNavigate } from "react-router-dom";

const initialTask: TaskInput = {
  title: "",
  description: "",
  status: TaskStatus.ToDo,
};

const NewTaskForm = () => {
  const [newTask, setNewTask] = useState<TaskInput>(initialTask);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [columns] = useState<Column[]>(initialColumns);
  const [activeColumn, setActiveColumn] = useState<number>(TaskStatus.ToDo);

  const { subscription } = useTaskWebSocket();
  const navifation = useNavigate()



  const addNewTask = () => {
    setError(null);

    if (!newTask.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!subscription) {
      setError("WebSocket not connected");
      return;
    }

    setLoading(true);

    sendTaskAction(subscription, "create", {
      ...newTask,
      status: activeColumn,
    });

    navifation("/")

    setLoading(false);
    setNewTask(initialTask);
  };

  return (
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
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
        placeholder="Task description"
        className={styles.addTaskTextarea}
      />

      <label className={styles.selectLabel}>
        Move to
        <select
          value={activeColumn}
          onChange={(e) => setActiveColumn(Number(e.target.value))}
          className={styles.addTaskSelect}
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
          className={styles.addTaskButton}
          onClick={addNewTask}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
    </div>
  );
};

export default NewTaskForm;
