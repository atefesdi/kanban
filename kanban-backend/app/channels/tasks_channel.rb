# app/channels/tasks_channel.rb
class TasksChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tasks:all"
    tasks = Task.all
    transmit({ action: "initial", tasks: tasks })
  end

  # Handle incoming updates from client
  def update(data)
    task_data = data["task"]
    task = Task.find_by(id: task_data["id"])
    return unless task

    task.update(
      title: task_data["title"],
      description: task_data["description"],
      status: task_data["status"]
    )

    # Broadcast updated task to all subscribers
    ActionCable.server.broadcast("tasks:all", { action: "update", task: task })
  rescue ActiveRecord::RecordNotFound => e
    transmit({ action: "error", message: e.message })
  end

  def create(data)
    task = Task.create(data["task"])
    ActionCable.server.broadcast("tasks:all", { action: "create", task: task })
  end

  def delete(data)
    task = Task.find_by(id: data["task"]["id"])
    return unless task

    task.destroy
    ActionCable.server.broadcast("tasks:all", { action: "delete", task: task })
  end
end
