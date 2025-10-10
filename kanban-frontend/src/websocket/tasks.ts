// src/websocket/tasks.ts
import * as ActionCable from "@rails/actioncable";
import type { Task } from "../types/types";

export type TaskAction = "create" | "update" | "delete" | "initial" | "error";

export interface TaskPayload {
  action: TaskAction;
  task?: Task;
  tasks?: Task[];
  message?: string;
}

export interface TaskChannelSubscription {
  unsubscribe: () => void;
  send: (data: Record<string, unknown>) => void;
}

const WS_HOST = import.meta.env.VITE_WS_URL ?? "ws://localhost:3000/cable";

export const subscribeToTasks = (
  onMessage: (payload: TaskPayload) => void
): TaskChannelSubscription => {
  const cable = ActionCable.createConsumer(WS_HOST);

  const subscription = cable.subscriptions.create(
    { channel: "TasksChannel" },
    {
      connected() {
        console.debug("[WS] Connected to TasksChannel");
      },
      disconnected() {
        console.debug("[WS] Disconnected from TasksChannel");
      },
      received(raw: unknown) {
        if (!raw || typeof raw !== "object") {
          console.error("[WS] ❌ Invalid message received:", raw);
          return;
        }

        const payload = raw as TaskPayload;

        if (!("action" in payload)) {
          console.error("[WS] ❌ Missing 'action' in message:", payload);
          return;
        }

        onMessage(payload);
      },
    }
  );

  return {
    unsubscribe: () => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.warn("[WS] Failed to unsubscribe:", error);
      }
    },
    send(data) {
      try {
        subscription.send(data);
      } catch (error) {
        console.error("[WS] ❌ Failed to send message:", error);
      }
    },
  };
};

export const sendTaskAction = (
  subscription: TaskChannelSubscription,
  action: Exclude<TaskAction, "initial" | "error">,
  payload: Partial<Task> | { id: number }
) => {
  subscription.send({ action, task: payload });
};
