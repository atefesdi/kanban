class ApplicationController < ActionController::API
    before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
  end

  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    begin
      decoded = JWT.decode(token, Rails.application.secret_key_base)
      @current_user = User.find(decoded[0]["user_id"])
    rescue
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end

end
