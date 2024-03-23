class PizzaDeliveryGeocoder
  attr_reader :pizza_delivery

  def initialize(pizza_delivery)
    @pizza_delivery = pizza_delivery
  end

  def call
    return unless location_changed?

    geocode_result = Geocoder.search([pizza_delivery.latitude, pizza_delivery.longitude]).first
    pizza_delivery.update!(
      address1: geocode_result&.street_address,
      city: geocode_result&.city,
      state: geocode_result&.state,
      postal_code: geocode_result&.postal_code
    )
  end

  private

  attr_reader :sighting

  def location_changed?
    pizza_delivery.saved_change_to_latitude? || pizza_delivery.saved_change_to_longitude?
  end
end
