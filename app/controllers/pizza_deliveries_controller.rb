class PizzaDeliveriesController < ApplicationController
  def index
    @pizza_deliveries = PizzaDelivery.order(created_at: :desc).page(params[:page])
  end

  def show
    @pizza_delivery = PizzaDelivery.find(params[:id])
  end

  def new
    @pizza_delivery = PizzaDelivery.new
  end

  def create
    @pizza_delivery = PizzaDelivery.new(permitted_params)

    if @pizza_delivery.save
      redirect_to pizza_deliveries_path
    else
      render :new
    end
  end

  def edit
    @pizza_delivery = PizzaDelivery.find(params[:id])
  end

  def update
    @pizza_delivery = PizzaDelivery.find(params[:id])
    @pizza_delivery.assign_attributes(permitted_params)

    if @pizza_delivery.save
      redirect_to pizza_deliveries_path
    else
      render :edit
    end
  end

  def destroy
    @pizza_delivery = PizzaDelivery.find(params[:id])
    @pizza_delivery.destroy
    redirect_to pizza_deliveries_path
  end

  private

  def permitted_params
    params
      .require(:pizza_delivery)
      .permit(
        :pizza_type,
        :size,
        :crust,
        :address1,
        :address2,
        :city,
        :state,
        :postal_code,
        :latitude,
        :longitude
      )
  end
end
