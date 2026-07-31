# frozen_string_literal: true

class CreateLeads < ActiveRecord::Migration[8.1]
  def change
    create_table :leads do |t|
      t.string :zip_code

      t.timestamps
    end
  end
end
