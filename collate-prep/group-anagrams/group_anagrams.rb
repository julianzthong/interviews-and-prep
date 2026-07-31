# frozen_string_literal: true

# Groups an array of strings into anagram groups.
# Strings that are anagrams of each other should be grouped together.
def group_anagrams(words)
  memory_store = Hash.new { |h, k| h[k] = [] }

  words.each do |word|
    sorted_word = word.gsub(/[[:punct:]]/, '').downcase.chars.sort.join

    memory_store[sorted_word] << word
  end

  memory_store.values
end

# input = ["eat", "tea", "tan", "ate", "nat", "bat"]

# expected output:
# [
#   ["eat", "tea", "ate"],
#   ["tan", "nat"],
#   ["bat"]
# ]