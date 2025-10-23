class UsersController < ApplicationController
  before_action :authenticate_user!

  def show
    render json: user_json(current_user)
  end

  def update
    if current_user.update(user_params)
      if params[:avatar].present?
        current_user.avatar.attach(params[:avatar])
      end

      render json: user_json(current_user), status: :ok

    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end


  private

  def user_params
    params.permit(:name, :email)
  end

  def user_json(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: avatar_url_for(user)
    }
  end

  def avatar_url_for(user)
    return nil unless user.avatar.attached?
    Rails.application.routes.url_helpers.rails_blob_url(user.avatar, only_path: false)
  end
end
