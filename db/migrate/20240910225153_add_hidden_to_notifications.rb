class AddHiddenToNotifications < ActiveRecord::Migration[7.2]
  def change
    add_column :notifications, :hidden, :boolean, default: false, null: false
  end
end
