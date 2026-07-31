# frozen_string_literal: true

class AddAgentToLeads < ActiveRecord::Migration[8.1]
  def change
    add_reference :leads, :agent, null: false, foreign_key: true
  end
end
