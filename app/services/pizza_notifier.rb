class PizzaNotifier
  attr_reader :pizza_delivery

  def initialize(pizza_delivery)
    @pizza_delivery = pizza_delivery
  end

  def notify_create
    User.find_each do |user|
      Notification.create(
        message: "New pizza delivery created in #{pizza_delivery.city}, #{pizza_delivery.state}",
        user: user
      )
    end
  end
end
