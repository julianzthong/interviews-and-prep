# frozen_string_literal: true

class Agent < ApplicationRecord
  validates :name, presence: true
  has_many :leads
end

# == Schema Information
#
# Table name: agents
#
#  id              :integer          not null, primary key
#  accepting_leads :boolean
#  name            :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#