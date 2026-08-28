class AddSourceAndExternalIdToProperties < ActiveRecord::Migration[8.1]
  def change
    add_column :properties, :source, :string
    add_column :properties, :external_id, :string

    add_index :properties, [ :source, :external_id ], unique: true
  end
end
