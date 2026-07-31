require "rails_helper"

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
RSpec.describe Lead, type: :model do
  describe "validations" do
  it "is valid with a zip code" do
  lead = Lead.new(zip_code: "94107")

  ```
    expect(lead).to be_valid
  end

  it "requires a zip code" do
    lead = Lead.new

    expect(lead).not_to be_valid
  end
  ```

  end

  describe "associations" do
  it "can belong to an agent" do
  agent = Agent.create!(
  name: "Alice",
  accepting_leads: true
  )

  ```
    lead = Lead.create!(
      zip_code: "94107",
      agent: agent
    )

    expect(lead.agent).to eq(agent)
  end
  ```

  end
end
