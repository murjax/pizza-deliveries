class PizzaDelivery < ApplicationRecord
  enum pizza_type: {
    cheese: 1,
    pepperoni: 2,
    veggie: 3
  }

  enum size: {
    small: 1,
    medium: 2,
    large: 3
  }

  enum crust: {
    thin: 1,
    thick: 2
  }

  validates :pizza_type, presence: true
  validates :size, presence: true
  validates :crust, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true
end
