module RentalDataClients
  # An in-memory fake client for local dev/demos: returns a fixed, hardcoded
  # dataset instead of calling any real external API. No network access and
  # no API key required, so it's useful for exercising the full
  # client -> mapper -> importer pipeline (e.g. from the rental_data rake
  # tasks) without depending on a real source being reachable or configured.
  class FakeClient < BaseClient
    source_name "fake"
    base_url "https://fake-source.internal"
    requires_api_key false

    FAKE_LISTINGS = [
      { "id" => "fake-1", "address" => "100 Fake St", "city" => "Austin", "state" => "TX",
        "zip" => "78701", "beds" => 1, "baths" => 1.0, "sqft" => 650, "rent" => 1450, "available" => true },
      { "id" => "fake-2", "address" => "200 Fake St", "unit" => "Apt 3B", "city" => "Austin", "state" => "TX",
        "zip" => "78701", "beds" => 2, "baths" => 1.5, "sqft" => 900, "rent" => 1950, "available" => true },
      { "id" => "fake-3", "address" => "300 Fake Ave", "city" => "Denver", "state" => "CO",
        "zip" => "80202", "beds" => 3, "baths" => 2.0, "sqft" => 1200, "rent" => 2600, "available" => false },
      { "id" => "fake-4", "address" => "400 Fake Blvd", "city" => "Seattle", "state" => "WA",
        "zip" => "98101", "beds" => 0, "baths" => 1.0, "sqft" => 450, "rent" => 1300, "available" => true },
      { "id" => "fake-5", "address" => "500 Fake Ln", "city" => "Chicago", "state" => "IL",
        "zip" => "60601", "beds" => 2, "baths" => 2.0, "sqft" => 1000, "rent" => 2100, "available" => true }
    ].freeze

    private

    def request_listings(**_params)
      FAKE_LISTINGS
    end

    def parse_listing(raw)
      Listing.new(
        source: self.class.source_name,
        external_id: raw["id"],
        address: raw["address"],
        unit: raw["unit"],
        city: raw["city"],
        state: raw["state"],
        zip_code: raw["zip"],
        bedrooms: raw["beds"],
        bathrooms: raw["baths"],
        square_feet: raw["sqft"],
        rent: raw["rent"],
        available: raw["available"],
        listed_at: Time.current
      )
    end
  end
end
