class Task < ApplicationRecord
  belongs_to :creator, class_name: "User", foreign_key: "created_by_id", optional: true
  belongs_to :assignee, class_name: "User", foreign_key: "assigned_by_id", optional: true

  after_create_commit -> { broadcast_task("created") }
  after_update_commit -> { broadcast_task("updated") }
  after_destroy_commit -> { broadcast_task("destroyed") }

  def broadcast_task(action)
    payload = {
      action: action, # "created" | "updated" | "destroyed"
      task: as_json(
        only: [:id, :title, :description, :status, :created_by_id, :assigned_by_id, :updated_at]
      )
    }
    ActionCable.server.broadcast("tasks:all", payload)
    # If you're using per-user stream:
    # TasksChannel.broadcast_to(creator, payload) if creator
  end
end
