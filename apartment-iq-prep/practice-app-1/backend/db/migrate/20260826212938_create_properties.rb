class CreateProperties < ActiveRecord::Migration[8.1]
  def change
    create_table :properties do |t|
      t.string :address, null: false
      t.string :unit
      t.string :city, null: false
      t.string :state, null: false
      t.string :zip_code, null: false
      t.integer :bedrooms, null: false
      t.decimal :bathrooms, precision: 3, scale: 1, null: false
      t.integer :square_feet
      t.decimal :rent, precision: 10, scale: 2, null: false
      t.boolean :available, default: true, null: false
      t.datetime :listed_at

      t.timestamps
    end

    add_index :properties, :city
    add_index :properties, :zip_code
    add_index :properties, :available
  end
end
