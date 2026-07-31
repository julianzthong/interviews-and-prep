# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Agent, type: :model do
  it 'is valid with a name' do
    agent = Agent.new(
      name: 'Alice',
      accepting_leads: true
    )

    expect(agent).to be_valid
  end

  it 'requires a name' do
    agent = Agent.new(
      accepting_leads: true
    )

    expect(agent).not_to be_valid
  end
end
