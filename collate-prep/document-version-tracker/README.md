# Document Version Tracker

Simple `DocumentVersionTracker` implementation in Ruby.

Usage:

```ruby
require_relative 'document_version_tracker'

tracker = DocumentVersionTracker.new
tracker.save(1, "first draft")
tracker.save(1, "second draft")
tracker.get(1, 1) # => "first draft"
tracker.history(1) # => {1 => "first draft", 2 => "second draft"}
```

Run tests:

```bash
ruby test_document_version_tracker.rb
```
