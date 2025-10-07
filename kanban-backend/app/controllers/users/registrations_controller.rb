class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # POST /users
  def create
    build_resource(sign_up_params)

    if resource.save
      token = Warden::JWTAuth::UserEncoder.new.call(
      resource,
      :user, # Devise scope
      nil    # optional payload
    ).first


      render json: {
        user: {
          id: resource.id,
          name: resource.name,
          email: resource.email
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
end
