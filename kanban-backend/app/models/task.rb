class Task < ApplicationRecord
  belongs_to :created_by, class_name: "User"
  belongs_to :assigned_by, class_name: "User", optional: true
end
