# app/controllers/users/sessions_controller.rb
class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    token = JWT.encode({ user_id: resource.id }, Rails.application.secret_key_base)

    render json: {
      user: { id: resource.id, email: resource.email },
      message: 'Logged in successfully.',
      token: token
    }, status: :ok
  end

  def respond_to_on_destroy
    head :no_content
  end
end
