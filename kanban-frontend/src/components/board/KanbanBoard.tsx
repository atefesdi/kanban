// KanbanBoard.tsx
import { TaskStatus, type Column, type Task, initialColumns } from "../../types/types";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./KanbanBoard.module.css";
import { IoAdd } from "react-icons/io5";
import { subscribeToTasks, sendTaskAction, type TaskPayload, type TaskChannelSubscription } from "../../websocket/tasks";


const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [dragInfo, setDragInfo] = useState<Task | null>(null);
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);

  const subscriptionRef = useRef<TaskChannelSubscription | null>(null);


  useEffect(() => {
    const subscription = subscribeToTasks((payload: TaskPayload & { tasks?: Task[] }) => {
      if (payload.action === "initial" && payload.tasks) {
        setColumns(initialColumns.map((c) => ({
          ...c,
          tasks: payload.tasks!.filter((t) => (t.status ?? TaskStatus.ToDo) === c.id),
        })));
      } else {
        handleRealtimeUpdate(payload);
      }
    });

    subscriptionRef.current = subscription;

    return () => subscription.unsubscribe();
  }, []);

  const handleRealtimeUpdate = useCallback((payload: TaskPayload) => {
    const { action, task, tasks } = payload;
    if (!action) return;

    setColumns((prev) => {
      let updated = [...prev].map((col) => ({ ...col, tasks: [...col.tasks] }));

      switch (action) {
        case "initial":
          if (tasks) {
            updated = updated.map((col) => ({
              ...col,
              tasks: tasks.filter(
                (t) => (t.status ?? TaskStatus.ToDo) === col.id
              ),
            }));
          }
          break;

        case "create": {
          if (task) {
            const targetCol = updated.find(
              (col) => col.id === (task.status ?? TaskStatus.ToDo)
            );
            targetCol?.tasks.push(task);
          }
          break;
        }

        case "update": {
          if (task) {
            updated.forEach((col) => {
              col.tasks = col.tasks.filter((t) => t.id !== task.id);
            });
            const targetCol = updated.find(
              (col) => col.id === (task.status ?? TaskStatus.ToDo)
            );
            targetCol?.tasks.push(task);
          }
          break;
        }

        case "delete": {
          if (task) {
            updated.forEach(
              (col) => (col.tasks = col.tasks.filter((t) => t.id !== task.id))
            );
          }
          break;
        }
      }

      return updated;
    });
  }, []);

  const handleDragStart = (task: Task) => setDragInfo(task);

  const handleDrop = (columnId: number) => {
    if (!dragInfo || !subscriptionRef.current) return;

    const updatedTask = { ...dragInfo, status: columnId };
    setDragInfo(null);
    sendTaskAction(subscriptionRef.current, "update", updatedTask);
  };

  const removeTask = (taskId: number) => {
    if (!subscriptionRef.current) return;
    sendTaskAction(subscriptionRef.current, "delete", { id: taskId } as Task);
  };

  return (
    <>
      <Link to="/new-task" className={styles.popup}>
        Add New Task <IoAdd />
      </Link>

      <div className={styles.boardWrapper}>
        <div className={styles.board}>
          {columns.map((column) => (
            <div
              key={column.id}
              onDragOver={(e) => {
                e.preventDefault();
                setHoverColumn(column.id);
              }}
              onDragLeave={() => setHoverColumn(null)}
              onDrop={() => {
                handleDrop(column.id);
                setHoverColumn(null);
              }}
              className={`${styles.column} ${
                hoverColumn === column.id ? styles.columnHover : ""
              }`}
            >
              <h3 className={styles.columnTitle}>{column.title}</h3>

              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className={styles.task}
                  draggable
                  onDragStart={(e) => {
                    handleDragStart(task);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => setDragInfo(null)}
                >
                  <div className={styles.taskContent}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    {task.description && (
                      <span className={styles.taskDescription}>{task.description}</span>
                    )}
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeTask(task.id)}
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
