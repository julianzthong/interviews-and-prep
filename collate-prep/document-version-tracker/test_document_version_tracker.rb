require 'minitest/autorun'
require_relative 'document_version_tracker'

class DocumentVersionTrackerTest < Minitest::Test
  def setup
    @tracker = DocumentVersionTracker.new
  end

  def test_save_get_and_history
    @tracker.save(1, "first draft")
    @tracker.save(1, "second draft")
    @tracker.save(2, "another doc")

    assert_equal "first draft", @tracker.get(1, 1)
    assert_equal "second draft", @tracker.get(1, 2)
    assert_equal "another doc", @tracker.get(2, 1)

    expected = { 1 => "first draft", 2 => "second draft" }
    assert_equal expected, @tracker.history(1)

    assert_nil @tracker.get(1, 3)
    assert_equal({}, @tracker.history(999))
  end
end
