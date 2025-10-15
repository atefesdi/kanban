import { TaskStatus, type Column, type Task, initialColumns } from "../../types/types";
import { useEffect, useState, useCallback } from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./KanbanBoard.module.css";
import { IoAdd } from "react-icons/io5";
import { useTaskWebSocket } from "../../context/TaskWebSocketContext";
import type { TaskPayload } from "@/websocket/tasks";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [dragInfo, setDragInfo] = useState<Task | null>(null);
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);

  const { lastMessage, subscription, sendTaskAction } = useTaskWebSocket();

  const handleRealtimeUpdate = useCallback((payload : TaskPayload) => {
    const { action, task, tasks } = payload;
    if (!action) return;

    setColumns((prev) => {
      let updated = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));

      switch (action) {
        case "initial":
          if (tasks) {
            updated = updated.map((col) => ({
              ...col,
              tasks: tasks.filter((t) => (t.status ?? TaskStatus.ToDo) === col.id),
            }));
          }
          break;
        case "create":
          if (task) {
            updated.find((c) => c.id === (task.status ?? TaskStatus.ToDo))?.tasks.push(task);
          }
          break;
        case "update":
          if (task) {
            updated.forEach((col) => (col.tasks = col.tasks.filter((t) => t.id !== task.id)));
            updated.find((c) => c.id === (task.status ?? TaskStatus.ToDo))?.tasks.push(task);
          }
          break;
        case "delete":
          if (task) {
            updated.forEach((col) => (col.tasks = col.tasks.filter((t) => t.id !== task.id)));
          }
          break;
      }

      return updated;
    });
  }, []);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.action === "initial" && lastMessage.tasks) {
        setColumns(
          initialColumns.map((c) => ({
            ...c,
            tasks: lastMessage.tasks!.filter(
              (t) => (t.status ?? TaskStatus.ToDo) === c.id
            ),
          }))
        );
      } else {
        handleRealtimeUpdate(lastMessage);
      }
    }
  }, [lastMessage, handleRealtimeUpdate]);

  const handleDrop = (columnId: number) => {
    if (!dragInfo || !subscription) return;
    const updatedTask = { ...dragInfo, status: columnId };
    setDragInfo(null);
    sendTaskAction(subscription, "update", updatedTask);
  };

  const removeTask = (taskId: number) => {
    if (!subscription) return;
    sendTaskAction(subscription, "delete", { id: taskId } as Task);
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
                  onDragStart={() => setDragInfo(task)}
                  onDragEnd={() => setDragInfo(null)}
                >
                  <div className={styles.taskContent}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    {task.description && (
                      <span className={styles.taskDescription}>
                        {task.description}
                      </span>
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
        <Outlet />
      </div>
    </>
  );
};

export default KanbanBoard;
