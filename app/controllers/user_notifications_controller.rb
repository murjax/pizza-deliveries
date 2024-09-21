class UserNotificationsController < ApplicationController
  def create
    notification = Notification.new
    notification.assign_attributes(permitted_params)

    if notification.save
      render json: notification.to_json
      NotificationRedis.redis.publish("notifications_#{notification.user_id}", notification.attributes.to_json)
      # NotificationChannel.broadcast_to(notification.user, notification)
    else
      render json: { errors: notification.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def permitted_params
    params.require(:notification).permit(:message, :user_id)
  end
end
