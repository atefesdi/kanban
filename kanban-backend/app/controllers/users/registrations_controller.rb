class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # POST /users
  def create
    build_resource(sign_up_params)

    if resource.save
      token = Warden::JWTAuth::UserEncoder.new.call(
      resource,
      :user,
      nil
    ).first
      render json: {
        user: {
          id: resource.id,
          name: resource.name,
          email: resource.email,
          avatar_url: avatar_url_for(resource)
        },
        token: token
      }, status: :ok
    else
      Rails.logger.info("Signup errors: #{resource.errors.full_messages}")
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

    def avatar_url_for(user)
    return nil unless user.avatar.attached?
    Rails.application.routes.url_helpers.rails_blob_url(user.avatar, only_path: false)
  end
end
