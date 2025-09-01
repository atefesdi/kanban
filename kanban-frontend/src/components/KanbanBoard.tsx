import { useState } from "react";
import type { Column, Task } from "./types";

const initialColumns: Column[] = [
  { id: 1, title: "To Do", tasks: [] },
  { id: 2, title: "In Progress", tasks: [] },
  { id: 3, title: "Done", tasks: [] },
];


const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      {columns.map((column) => (
        <div
          key={column.id}
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "0.5rem",
          }}
        >
          <h3>{column.title}</h3>
          {column.tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: "1px solid #aaa",
                borderRadius: "4px",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                background: "#f9f9f9",
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
