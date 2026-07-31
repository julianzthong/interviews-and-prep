# Document Events State

## Practice Problem

You have a list of document events, each with:
- `id` — document identifier
- `timestamp` — event time
- `action` — one of `created`, `edited`, or `deleted`

Write a Ruby function that returns the current state of each document based on the latest event for that document.

### Behavior

- Use the latest event for each document ID by timestamp.
- If the latest action is `deleted`, the document should be removed from the final result.
- Otherwise, return the document's current action.

### Example

```ruby
events = [
  { id: 1, timestamp: 1, action: "created" },
  { id: 1, timestamp: 3, action: "edited" },
  { id: 2, timestamp: 2, action: "created" },
  { id: 2, timestamp: 4, action: "deleted" },
  { id: 1, timestamp: 5, action: "deleted" }
]

# expected output:
# {}
```

### Notes

- The function should be deterministic and handle events in any order.
- If the same `id` has multiple events, only the event with the highest `timestamp` matters.
- Deleted documents should not appear in the result.

## Suggested function signature

```ruby
def current_document_states(events)
  # Your implementation here
end
```

## What to include

- Example inputs and outputs
- Edge cases for empty event lists
- Edge cases for duplicate timestamps
- Clarify whether `created` documents with no further edits should remain in the result

## Output format

Return a hash mapping document IDs to their latest action, excluding deleted documents.

```ruby
{
  1 => "created",
  2 => "edited"
}
```
