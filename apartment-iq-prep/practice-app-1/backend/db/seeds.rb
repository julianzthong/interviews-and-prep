# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

Property.destroy_all

cities = [
  %w[Austin TX], %w[Denver CO], %w[Seattle WA],
  %w[Chicago IL], %w[Miami FL], %w[Portland OR]
]

60.times do
  city, state = cities.sample

  Property.create!(
    address: Faker::Address.street_address,
    unit: [ nil, "Apt #{rand(1..40)}" ].sample,
    city: city,
    state: state,
    zip_code: Faker::Address.zip_code[0..4],
    bedrooms: rand(0..4),
    bathrooms: [ 1, 1.5, 2, 2.5, 3 ].sample,
    square_feet: rand(400..2200),
    rent: rand(1200..4500),
    available: [ true, true, true, false ].sample,
    listed_at: rand(60).days.ago
  )
end

puts "Seeded #{Property.count} properties"
