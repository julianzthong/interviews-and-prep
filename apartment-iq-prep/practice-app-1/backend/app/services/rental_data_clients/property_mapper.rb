module RentalDataClients
  # Translates a normalized Listing (whatever client it came from) into an
  # unsaved Property. Deliberately has no knowledge of the database beyond the
  # Property class itself - it does not save, find, or upsert anything. Callers
  # decide what to do with the record it hands back (create, match against an
  # existing property, diff for updates, etc).
  class PropertyMapper
    def self.call(listing)
      new(listing).call
    end

    def initialize(listing)
      @listing = listing
    end

    def call
      Property.new(
        source: listing.source,
        external_id: listing.external_id,
        address: listing.address,
        unit: listing.unit,
        city: listing.city,
        state: listing.state,
        zip_code: listing.zip_code,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        square_feet: listing.square_feet,
        rent: listing.rent,
        available: listing.available,
        listed_at: listing.listed_at,
        raw_data: listing.to_h
      )
    end

    private

    attr_reader :listing
  end
end
