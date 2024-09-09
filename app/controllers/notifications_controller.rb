class NotificationsController < ApplicationController
  def index
    render json: Notification.where(user: current_user).to_json
  end
end
