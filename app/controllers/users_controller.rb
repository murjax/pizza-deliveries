class UsersController < ApplicationController
  def index
    @users = User.order(:name).page(params[:page])
  end
end
