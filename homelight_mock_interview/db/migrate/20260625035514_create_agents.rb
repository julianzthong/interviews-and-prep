# frozen_string_literal: true

class CreateAgents < ActiveRecord::Migration[8.1]
  def change
    create_table :agents do |t|
      t.string :name
      t.boolean :accepting_leads

      t.timestamps
    end
  end
end
