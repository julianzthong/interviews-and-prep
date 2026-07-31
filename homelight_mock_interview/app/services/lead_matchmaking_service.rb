# frozen_string_literal: true

class LeadMatchMatchmakingService
  def match_agents(zip_code)
    Agent.where(accepting_leads: true).where('? = ANY(zip_codes)', zip_code)
  end

  def assign_agent(lead_id, agent_id)
    agent = Agent.find(agent_id)
    return { success: false, error: 'Agent is not accepting leads' } unless agent.accepting_leads

    lead = Lead.find(lead_id)
    if lead != nil
      lead.update(agent: agent)

    { success: true, lead: lead }
  end
end
