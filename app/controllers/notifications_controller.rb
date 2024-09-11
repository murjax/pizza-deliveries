class NotificationsController < ApplicationController
  def update
    notification = Notification.find(params[:id])
    notification.assign_attributes(permitted_params)

    if notification.save
      render json: notification.to_json
    else
      render json: { errors: notification.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def permitted_params
    params.require(:notification).permit(:hidden)
  end
end
