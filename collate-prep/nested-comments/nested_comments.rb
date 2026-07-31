# frozen_string_literal: true

# Builds a nested tree from a flat array of comments.
# Each comment is expected to be a Hash with keys: :id, :parent_id, :content
# Returns an Array of top-level comment Hashes with a :children key (Array).
def build_comment_tree(comments)
  nested_comments = []
  comments_with_children = {}

  comments.each do |comment|
    comment[:children] = []
    comments_with_children[comment[:id]] = comment
  end

  comments_with_children.each_value do |comment|
    comments_with_children[comment[:parent_id]][:children] << comment if comment[:parent_id]
  end

  comments_with_children.each_value do |comment|
    nested_comments << comment unless comment[:parent_id]
  end

  nested_comments
end

# comments = [
#   { id: 1, parent_id: nil, content: "first post" },
#   { id: 2, parent_id: 1, content: "reply to first" },
#   { id: 3, parent_id: 1, content: "another reply" },
#   { id: 4, parent_id: 2, content: "reply to reply" },
#   { id: 5, parent_id: nil, content: "second post" },
# ]

# expected output:
# [
#   { id: 1, content: "first post", children: [
#     { id: 2, content: "reply to first", children: [
#       { id: 4, content: "reply to reply", children: [] }
#     ]},
#     { id: 3, content: "another reply", children: [] }
#   ]},
#   { id: 5, content: "second post", children: [] }
# ]