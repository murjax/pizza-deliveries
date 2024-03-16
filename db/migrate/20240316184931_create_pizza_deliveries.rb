class CreatePizzaDeliveries < ActiveRecord::Migration[7.1]
  def change
    create_table :pizza_deliveries do |t|
      t.integer :pizza_type, null: false
      t.integer :size, null: false
      t.integer :crust, null: false
      t.string :address1
      t.string :address2
      t.string :city
      t.string :state
      t.string :postal_code
      t.string :latitude, null: false
      t.string :longitude, null: false

      t.timestamps
    end
  end
end
