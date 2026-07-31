# frozen_string_literal: true

class Lead < ApplicationRecord
  belongs_to :agent
end

# == Schema Information
#
# Table name: leads
#
#  id         :integer          not null, primary key
#  zip_code   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  agent_id   :integer          not null
#
# Indexes
#
#  index_leads_on_agent_id  (agent_id)
#
# Foreign Keys
#
#  agent_id  (agent_id => agents.id)
#