import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  sendTaskAction,
  subscribeToTasks,
  type TaskChannelSubscription,
  type TaskPayload,
} from "../websocket/tasks";

interface TaskWebSocketContextValue {
  subscription: TaskChannelSubscription | null;
  lastMessage: TaskPayload | null;
  sendTaskAction: typeof sendTaskAction;
}

const TaskWebSocketContext = createContext<TaskWebSocketContextValue>({
  subscription: null,
  lastMessage: null,
  sendTaskAction
});

export const TaskWebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastMessage, setLastMessage] = useState<TaskPayload | null>(null);
  const subscriptionRef = useRef<TaskChannelSubscription | null>(null);

  useEffect(() => {
    const subscription = subscribeToTasks((payload: TaskPayload) => {
      setLastMessage(payload);
    });
    subscriptionRef.current = subscription;

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <TaskWebSocketContext.Provider
      value={{ subscription: subscriptionRef.current, lastMessage, sendTaskAction }}
    >
      {children}
    </TaskWebSocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskWebSocket = () => useContext(TaskWebSocketContext);
