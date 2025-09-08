class Task < ApplicationRecord
  belongs_to :created_by, class_name: "User", optional: true
  belongs_to :assigned_by, class_name: "User", optional: true
end
