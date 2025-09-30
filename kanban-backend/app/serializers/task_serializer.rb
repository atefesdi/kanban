class TaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :created_at, :updated_at


  belongs_to :creator, serializer: UserSerializer, if: -> { object.creator.present? }
  belongs_to :assignee, serializer: UserSerializer, if: -> { object.assignee.present? }
end
