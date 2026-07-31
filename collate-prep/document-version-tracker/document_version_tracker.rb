class DocumentVersionTracker
  def initialize
    @store = Hash.new { |h, k| h[k] = [] }
  end

  # Save a new version for doc_id. Returns the new version number.
  def save(doc_id, content)
    @store[doc_id] << content
    true
  end

  # Retrieve content for a specific version (1-based).
  # Returns nil if the document or version doesn't exist.
  def get(doc_id, version)
    versions = @store[doc_id]
    return nil if version.to_i < 1 || version.to_i > versions.size

    versions[version.to_i - 1]
  end

  # Return a hash of all versions for the document: { version_number => content }
  def history(doc_id)
    versions = @store[doc_id]
    result = {}
    versions.each_with_index { |c, i| result[i + 1] = c }
    result
  end
end
