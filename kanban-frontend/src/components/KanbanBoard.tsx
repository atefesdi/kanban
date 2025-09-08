import type { Column, Task } from "./types";
import { getAllTasks } from "../api/task";
import { useEffect, useState } from "react";

const initialColumns: Column[] = [
  { id: 1, title: "To Do", tasks: [] },
  { id: 2, title: "In Progress", tasks: [] },
  { id: 3, title: "Done", tasks: [] },
];


const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllTasks();
        if (data.length > 0) {
          const updatedColumns = [...initialColumns];
          data.forEach((item: Task) => {
            if (item.status === 0 || item.status === null) {
              updatedColumns[0].tasks.push(item);
            } else if (item.status === 1) {
              updatedColumns[1].tasks.push(item);
            } else {
              updatedColumns[2].tasks.push(item);
            }
          });

          setColumns(updatedColumns);
        }
      } catch (error: unknown) {
        console.log("error :>> ", error);
      }
    };
    fetchData();
  }, [setColumns]);

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      {columns.map((column) => (
        <div
          key={column.id}
          style={{
            flex: 1,
            border: "1px solid #2c2e64ff",
            borderRadius: "8px",
            padding: "0.5rem",
            background: "#3e37bdff",
          }}
        >
          <h3>{column.title}</h3>
          {column.tasks.map((task) => (
            <div
              key={`${column.id}-${task.id}`}
              style={{
                border: "1px solid #2c2e64ff",
                borderRadius: "4px",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                background: "#3e37bdff",
              }}
            >
              {task.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
