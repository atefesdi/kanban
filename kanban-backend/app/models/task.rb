class Task < ApplicationRecord
  belongs_to :creator, class_name: "User", foreign_key: "created_by_id", optional: true
  belongs_to :assignee, class_name: "User", foreign_key: "assigned_by_id", optional: true
end
