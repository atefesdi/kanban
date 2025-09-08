class Users::SessionsController < Devise::SessionsController
   respond_to :json

  private

  def respond_with(resource, _opts = {})
    token = request.env['warden-jwt_auth.token']
    render json: {
      message: "Logged in successfully",
      token: token,
      user: { id: resource.id, email: resource.email, name: resource.email }
    }, status: :ok
  end
end
