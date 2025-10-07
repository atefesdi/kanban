class TasksController < ApplicationController
  # no need for :authenticate_user! anymore
  def index
    # tasks = Task.where("created_by_id = ? OR assigned_by_id = ?", current_user.id, current_user.id)
    tasks = Task.all
    render json: tasks
  end

  def create
    task = current_user.created_tasks.build(task_params)
    if task.save
      render json: task, status: :created
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    task = Task.find_by(id: params[:id])
    if task.nil?
      render json: { error: "Task not found" }, status: :not_found
    elsif task.created_by_id == current_user.id
      task.destroy
      render json: { message: "Task deleted successfully" }, status: :ok
    else
      render json: { error: "Not authorized to delete this task" }, status: :forbidden
    end
  end

  def update
    task = Task.find_by(id: params[:id]);

    if task.nil?
      render json: { error: "Task not found" }, status: :not_found
    elsif task.created_by_id != current_user.id && task.assigned_by_id != current_user.id
      render json: { error: "Not authorized to update this task"}, status: :forbidden
    elsif task.update(task_params)
      render json: task, status: :ok
    else
      render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def task_params
    params.require(:task).permit(:title, :description, :assigned_by_id, :status)
  end
end
