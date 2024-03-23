class PizzaDeliverySerializer
  attr_reader :pizza_delivery

  def initialize(pizza_delivery)
    @pizza_delivery = pizza_delivery
  end

  def attributes
    pizza_delivery
      .attributes
      .merge(
        formatted_location:,
        pizza_description:,
        formatted_created_at:
      )
  end

  private

  def formatted_location
    "#{pizza_delivery.city}, #{pizza_delivery.state}"
  end

  def pizza_description
    "#{pizza_delivery.size.titleize} #{pizza_delivery.pizza_type} #{pizza_delivery.crust} crust"
  end

  def formatted_created_at
    pizza_delivery.created_at.strftime('%m/%d/%Y %I:%M%P')
  end
end
