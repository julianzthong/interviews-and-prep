# Mock Pair Programming Exercise

Scenario:
You work at a real-estate marketplace.

Models:
- Agent
- Lead

Your task is to implement lead assignment logic.

Run tests:
    ruby spec/lead_assignment_spec.rb

Requirements:
1. Return only agents that serve the lead's zip code.
2. Return only agents that are accepting leads.
3. Sort matching agents by lead_count ascending.
4. assign_agent should return the best matching agent.
5. Return nil if no agent qualifies.

Stretch goals:
- Handle ties alphabetically.
- Add additional tests.
