class HomeController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    redirect_to pizza_deliveries_path if current_user.present?
  end
end
