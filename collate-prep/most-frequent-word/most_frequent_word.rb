# frozen_string_literal: true

# Returns the most frequently occurring word in the given text.
# Comparison should be case-insensitive and punctuation should be ignored.
# If multiple words tie, the earliest-occurring word wins.
def most_frequent_word(text)
  words = text.split(' ')
  word_count = {}
  words.each do |word|
    word = word.gsub(/[[:punct:]]/, '').downcase

    word_count[word].nil? ? word_count[word] = 1 : word_count[word] += 1
  end

  result = ''
  max_count = 0
  word_count.each do |word, count|
    if count > max_count
      result = word
      max_count = count
    end
  end

  result
end
