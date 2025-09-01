class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable

  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Associations for Kanban
  has_many :created_tasks, class_name: "Task", foreign_key: "created_by_id"
  has_many :assigned_tasks, class_name: "Task", foreign_key: "assigned_by_id"
end
