
class Users::SessionsController < Devise::SessionsController
   respond_to :json

  private

  def respond_with(resource, _opts = {})
    token = request.env['warden-jwt_auth.token']
    render json: {
      message: "Logged in successfully",
      token: token,
      user: { id: resource.id, email: resource.email, name: resource.email, avatar_url: avatar_url_for(resource) }
    }, status: :ok
  end

  def respond_to_on_destroy
    head :no_content
  end

  def avatar_url_for(user)
    return nil unless user.avatar.attached?
    Rails.application.routes.url_helpers.rails_blob_url(user.avatar, only_path: false)
  end
end
