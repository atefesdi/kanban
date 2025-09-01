class TasksController < ApplicationController
  before_action :authenticate_user!

  def index
    tasks = Task.all
    render json: tasks
  end

  def create
    task = current_user.created_tasks.build(task_params)
    if task.save
      render json: task, status: :created
    else
      render json: task.errors, status: :unprocessable_entity
    end
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :assigned_by_id)
  end
end
