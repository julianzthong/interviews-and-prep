FactoryBot.define do
  factory :property do
    address { Faker::Address.street_address }
    unit { [ nil, "Apt #{rand(1..40)}" ].sample }
    city { Faker::Address.city }
    state { Faker::Address.state_abbr }
    zip_code { Faker::Address.zip_code[0..4] }
    bedrooms { rand(0..4) }
    bathrooms { [ 1, 1.5, 2, 2.5, 3 ].sample }
    square_feet { rand(400..2200) }
    rent { rand(1200..4500) }
    available { true }
    listed_at { rand(30).days.ago }
  end
end
