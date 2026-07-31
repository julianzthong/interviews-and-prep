# frozen_string_literal: true

class User < ApplicationRecord
end

# == Schema Information
#
# Table name: users
#
#  id         :integer          not null, primary key
#  email      :string
#  name       :string
#  role       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#