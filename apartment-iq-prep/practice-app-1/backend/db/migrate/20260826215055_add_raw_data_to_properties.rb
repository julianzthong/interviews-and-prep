class AddRawDataToProperties < ActiveRecord::Migration[8.1]
  def change
    add_column :properties, :raw_data, :jsonb, default: {}, null: false
  end
end
