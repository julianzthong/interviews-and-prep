require "rails_helper"

RSpec.describe Property, type: :model do
  it "has a valid factory" do
    expect(build(:property)).to be_valid
  end

  it "requires address, city, state, zip_code" do
    property = build(:property, address: nil, city: nil, state: nil, zip_code: nil)

    expect(property).not_to be_valid
    expect(property.errors.attribute_names).to include(:address, :city, :state, :zip_code)
  end

  it "requires rent to be greater than 0" do
    expect(build(:property, rent: 0)).not_to be_valid
  end

  it "requires a 2-letter state abbreviation" do
    expect(build(:property, state: "California")).not_to be_valid
  end

  it "requires a 5-digit zip code" do
    expect(build(:property, zip_code: "abc")).not_to be_valid
  end

  describe "scopes" do
    it "filters by minimum bedrooms" do
      small = create(:property, bedrooms: 1)
      big = create(:property, bedrooms: 3)

      expect(Property.min_bedrooms(2)).to contain_exactly(big)
      expect(Property.min_bedrooms(nil)).to contain_exactly(small, big)
    end

    it "filters by max rent" do
      cheap = create(:property, rent: 1000)
      pricey = create(:property, rent: 5000)

      expect(Property.max_rent(2000)).to contain_exactly(cheap)
    end

    it "filters by city case-insensitively" do
      match = create(:property, city: "Austin")
      create(:property, city: "Denver")

      expect(Property.in_city("austin")).to contain_exactly(match)
    end
  end
end
