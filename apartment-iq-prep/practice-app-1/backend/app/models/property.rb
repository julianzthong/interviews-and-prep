class Property < ApplicationRecord
  validates :address, :city, :state, :zip_code, presence: true
  validates :bedrooms, numericality: { greater_than_or_equal_to: 0 }
  validates :bathrooms, numericality: { greater_than_or_equal_to: 0 }
  validates :rent, numericality: { greater_than: 0 }
  validates :state, length: { is: 2 }
  validates :zip_code, format: { with: /\A\d{5}\z/, message: "must be 5 digits" }

  scope :available, -> { where(available: true) }
  scope :available_filter, ->(value) { where(available: ActiveModel::Type::Boolean.new.cast(value)) if value.present? }
  scope :in_city, ->(city) { where("city ILIKE ?", city) if city.present? }
  scope :min_bedrooms, ->(count) { where("bedrooms >= ?", count) if count.present? }
  scope :max_rent, ->(amount) { where("rent <= ?", amount) if amount.present? }

  def full_address
    [ address, unit, city, state, zip_code ].compact_blank.join(", ")
  end
end
