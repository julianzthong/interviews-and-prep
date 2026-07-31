# document_events_state.rb

# This file is a starting point for the Collate interview prep problem.
# Implement the `current_document_states` function below.

# Example:
# events = [
#   { id: 1, timestamp: 1, action: 'created' },
#   { id: 1, timestamp: 3, action: 'edited' },
#   { id: 2, timestamp: 2, action: 'created' },
#   { id: 2, timestamp: 4, action: 'deleted' },
#   { id: 1, timestamp: 5, action: 'deleted' }
# ]
#
# Expected output: {}

def current_document_states(events)
  current_states = {}

  events.each do |event|
    unless current_states[event[:id]]
      current_states[event[:id]] = event
      next
    end

    next if current_states[event[:id]][:timestamp] >= event[:timestamp]

    if event[:action] == 'deleted'
      current_states.delete(event[:id])
    else
      current_states[event[:id]] = event
    end
  end

  current_states
end

if __FILE__ == $PROGRAM_NAME
  sample_events = [
    { id: 1, timestamp: 1, action: 'created' },
    { id: 1, timestamp: 3, action: 'edited' },
    { id: 2, timestamp: 2, action: 'created' },
    { id: 2, timestamp: 4, action: 'deleted' },
    { id: 1, timestamp: 5, action: 'deleted' }
  ]

  puts current_document_states(sample_events).inspect
end
